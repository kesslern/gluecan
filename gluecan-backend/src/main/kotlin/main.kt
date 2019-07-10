package us.kesslern

import io.javalin.Javalin
import io.javalin.core.security.Role
import io.javalin.core.security.SecurityUtil.roles
import io.javalin.http.Context
import org.eclipse.jetty.server.session.SessionHandler
import org.flywaydb.core.Flyway
import org.jetbrains.exposed.dao.*
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.TransactionManager
import org.jetbrains.exposed.sql.transactions.transaction
import org.slf4j.LoggerFactory
import java.lang.Math.max
import java.sql.Connection

internal enum class MyRole : Role {
    AUTHENTICATED
}

fun main() {
    val log = LoggerFactory.getLogger("main")
    val adminPass = System.getProperty("gluecan.pass", "change_me")
    val public = System.getProperty("gluecan.public", "false") == "true"
    val database = "jdbc:sqlite:gluecan"
    val flyway = Flyway.configure().dataSource(database, "su", null).load()
    flyway.migrate()
    Database.connect(database, driver = "org.sqlite.JDBC")
    TransactionManager.manager.defaultIsolationLevel = Connection.TRANSACTION_SERIALIZABLE

    val app = Javalin.create { config ->
        config.sessionHandler {
            val handler = SessionHandler()
            handler.maxInactiveInterval = 15 * 60
            handler
        }
        config.addStaticFiles("/frontend")
        config.addSinglePageRoot("/", "/frontend/index.html")
        config.accessManager { handler, ctx, permittedRoles ->
            val authenticatedViaHeader = ctx.header("X-Auth") == adminPass
            val authenticatedViaCookie = ctx.sessionAttribute<Boolean>("authenticated") == true
            val authenticated = authenticatedViaHeader || authenticatedViaCookie

            if (authenticatedViaHeader && !authenticatedViaCookie) {
                ctx.req.changeSessionId()
                ctx.sessionAttribute("authenticated", true)
            }

            if ((permittedRoles.contains(MyRole.AUTHENTICATED) && authenticated)
                || permittedRoles.size == 0
                || public
            ) {
                handler.handle(ctx)
            } else {
                ctx.status(401)
            }
        }
    }

    app.get("/api/pastes", { ctx ->
        transaction {
            ctx.dboToJson(PasteDBO.all())
        }
    }, roles(MyRole.AUTHENTICATED))

    fun template(paste: Paste) = """
        <html>
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>GlueCan #${paste.id}</title>
        <link rel="stylesheet" href="/solarized-light.css">
        <script src="/highlight.pack.js"></script>
        <script src="//cdnjs.cloudflare.com/ajax/libs/highlightjs-line-numbers.js/2.7.0/highlightjs-line-numbers.min.js"></script>
        <script>
          hljs.initHighlightingOnLoad();
          hljs.initLineNumbersOnLoad();
          const text = `${paste.text}`
          function copyToClipboard() {
            navigator.clipboard.writeText(text)
          }
        </script>
        <style>
          pre, body { margin: 0; padding: 0 }
          html { box-sizing: border-box; min-height: 100vh; width: 100% }
          td.hljs-ln-numbers {
            border-right: 1px solid black;
            padding: 0 5px;
            color: #859900;
          }
          td.hljs-ln-code {
            padding-left: 5px;
	        white-space: pre-wrap;
          }
          button {
            -webkit-border-radius: 3;
            -moz-border-radius: 3;
            border-radius: 3px;
            color: #626262;
            font-size: 20px;
            background: #e4e4e4;
            padding: 10px 20px 10px 20px;
            text-decoration: none;
          }
          button.hover {
            background: #3cb0fd;
            background-image: -webkit-linear-gradient(top, #3cb0fd, #3498db);
            background-image: -moz-linear-gradient(top, #3cb0fd, #3498db);
            background-image: -ms-linear-gradient(top, #3cb0fd, #3498db);
            background-image: -o-linear-gradient(top, #3cb0fd, #3498db);
            background-image: linear-gradient(to bottom, #3cb0fd, #3498db);
            text-decoration: none;
          }
        </style>
        </head>
        <body>
        <button onClick="copyToClipboard()">Copy</button>
        <pre><code id="paste"${if (paste.language != null) " class=${paste.language}" else ""}>${paste.toHtml()}</pre></code>
        </body>
        </html>
        """.trimIndent()

    app.get("/view/:id") { ctx ->
        val paste = transaction {
            val id = ctx.pathParam(":id").toInt()
            val paste = PasteDBO.findById(id)
            paste?.let {
                it.views++
                it
            }
        }

        if (paste == null) {
            ctx.result("Not found")
            ctx.status(410)
        } else {
            ctx.contentType("text/html")
            ctx.result(template(paste.toData()))
        }
    }

    app.delete("/api/pastes/:id", { ctx ->
        transaction {
            val id = ctx.pathParam(":id").toInt()
            val paste = PasteDBO.findById(id)

            if (paste != null) {
                paste.delete()
                ctx.status(200)
            } else {
                ctx.status(410)
            }
        }
    }, roles(MyRole.AUTHENTICATED))

    app.post("/api/pastes", { ctx ->
        val id = transaction {
            PastesTable.insert {
                it[language] = ctx.queryParam("lang")
                it[text] = ctx.body()
            }[PastesTable.id]
        }
        ctx.result(id.value.toString())
    }, roles(MyRole.AUTHENTICATED))

    app.start(8080)
}

data class Paste(
    val id: Int,
    val views: Int?,
    val language: String?,
    val text: String
)

object PastesTable : IntIdTable() {
    val views = integer("views")
    val language = text("language").nullable()
    val text = text("text")
}

interface DBOToData<T> {
    fun toData(): T
}

class PasteDBO(id: EntityID<Int>) : IntEntity(id), DBOToData<Paste> {
    companion object : IntEntityClass<PasteDBO>(PastesTable)

    var views by PastesTable.views
    var language by PastesTable.language
    var text by PastesTable.text

    override fun toData() = Paste(this.id.value, this.views, this.language, this.text)
}

fun Context.dboToJson(it: DBOToData<*>) = this.json(it.toData()!!)

fun Context.dboToJson(it: Iterable<DBOToData<*>>) = this.json(it.map { it.toData() })

fun Paste.toHtml(): String {
    val out = StringBuilder(max(16, this.text.length))
    for (c in text) {
        if (c.toInt() > 127 || c == '"' || c == '<' || c == '>' || c == '&') {
            out.append("&#")
            out.append(c.toInt())
            out.append(';')
        } else {
            out.append(c)
        }
    }
    return out.toString()
}