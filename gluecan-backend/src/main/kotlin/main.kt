package us.kesslern

import io.javalin.Javalin
import io.javalin.core.security.Role
import io.javalin.core.security.SecurityUtil.roles
import io.javalin.http.Context
import org.apache.commons.lang.StringEscapeUtils
import org.apache.commons.lang.StringUtils
import org.eclipse.jetty.server.Connector
import org.eclipse.jetty.server.Server
import org.eclipse.jetty.server.session.SessionHandler
import org.flywaydb.core.Flyway
import org.jetbrains.exposed.dao.*
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.TransactionManager
import org.jetbrains.exposed.sql.transactions.transaction
import org.slf4j.LoggerFactory
import java.lang.Math.max
import java.sql.Connection
import kotlin.random.Random
import org.eclipse.jetty.server.ServerConnector
import org.eclipse.jetty.util.log.JettyLogHandler.config
import org.eclipse.jetty.util.ssl.SslContextFactory

internal enum class MyRole : Role {
    AUTHENTICATED
}

object Config {
    val adminPass = System.getProperty("gluecan.pass", "change_me")
    val public = System.getProperty("gluecan.public", "false").toLowerCase() == "true"
    val database = "jdbc:sqlite:gluecan"
    val keystorePath: String? = System.getProperty("gluecan.keystorePath")
    val keystorePassword: String? = System.getProperty("gluecan.keystorePassword")
}

private fun getSslContextFactory(): SslContextFactory.Server {
    val sslContextFactory = SslContextFactory.Server()
    sslContextFactory.keyStorePath = Config.keystorePath
    sslContextFactory.setKeyStorePassword(Config.keystorePassword)
    return sslContextFactory
}

fun main() {
    val log = LoggerFactory.getLogger("main")
    val flyway = Flyway.configure().dataSource(Config.database, "su", null).load()
    flyway.migrate()
    Database.connect(Config.database, driver = "org.sqlite.JDBC")
    TransactionManager.manager.defaultIsolationLevel = Connection.TRANSACTION_SERIALIZABLE

    val app = Javalin.create { config ->
        config.server {
            val server = Server()

            val sslConnector = if (Config.keystorePath != null) {
                log.info("Enabling SSL")
                val sslConnector = ServerConnector(server, getSslContextFactory())
                sslConnector.setPort(8443)
                sslConnector
            } else null

            val connector = ServerConnector(server)
            connector.port = 8080

            if (sslConnector != null) {
                server.connectors = arrayOf(sslConnector, connector)
            } else {
                server.connectors = arrayOf(connector)
            }

            server
        }

        config.sessionHandler {
            val handler = SessionHandler()
            handler.maxInactiveInterval = 15 * 60
            handler
        }
        config.addStaticFiles("/frontend")
        config.addSinglePageRoot("/", "/frontend/index.html")
        config.accessManager { handler, ctx, permittedRoles ->
            val authenticatedViaHeader = ctx.header("X-Auth") == Config.adminPass
            val authenticatedViaCookie = ctx.sessionAttribute<Boolean>("authenticated") == true
            val authenticated = authenticatedViaHeader || authenticatedViaCookie

            if (authenticatedViaHeader && !authenticatedViaCookie) {
                ctx.req.changeSessionId()
                ctx.sessionAttribute("authenticated", true)
            }

            if ((permittedRoles.contains(MyRole.AUTHENTICATED) && authenticated)
                || permittedRoles.size == 0
                || Config.public
            ) {
                handler.handle(ctx)
            } else {
                ctx.status(401)
            }
        }
    }

    app.get("/api/pastes", { ctx ->
        val result = transaction { PasteDBO.all().map { it.toData() } }
            .map { it.copy(text = null) }

        ctx.json(
            result
        )

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
          
          let text
          fetch('/api/pastes/${paste.id}/raw')
            .then(response => response.text())
            .then(data => text = data)
          function copyToClipboard() {
            navigator.clipboard.writeText(text)
          }
        </script>
        <style>
          pre, body { margin: 0; padding: 0 }
          html, pre, body, code { box-sizing: border-box; min-height: 100vh; width: 100% }
          #paste {
            padding-left: 0;
          }
          td.hljs-ln-numbers {
            text-align: right;
            border-right: 1px solid black;
            padding: 0 3px;
            color: #859900;
          }
          td.hljs-ln-code {
            padding-left: 3px;
	        white-space: pre-wrap;
          }
          button {
            border-radius: 3px;
            color: #626262;
            font-size: 20px;
            background: #e4e4e4;
            padding: 8px 16px;
            text-decoration: none;
            position: fixed;
            bottom: 0;
            right: 0;
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
          code {
            padding-bottom: 45px !important;
          }
        </style>
        </head>
        <body>
        <button onClick="copyToClipboard()">Copy</button>
        <pre><code id="paste" class="hljs ${paste.language ?: ""}">${paste.toHtml()}</pre></code>
        </body>
        </html>
        """.trimIndent()

    app.get("/api/pastes/:id/raw") { ctx ->
        val paste = transaction {
            val id = ctx.pathParam(":id").toInt()
            PasteDBO.findById(id)
        }

        if (paste == null) {
            ctx.result("Not found")
            ctx.status(410)
        } else {
            ctx.contentType("text/plain")
            ctx.result(paste.text)
        }
    }

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
        val id = uniqueId()
        transaction {
            PastesTable.insert {
                it[PastesTable.id] = EntityID(id, PastesTable)
                it[language] = ctx.queryParam("lang")
                it[text] = ctx.body()
            }[PastesTable.id]
        }
        ctx.result(id.toString())
    }, roles(MyRole.AUTHENTICATED))

    app.start(8080)
}

data class Paste(
    val id: Int,
    val views: Int?,
    val language: String?,
    val text: String?
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

fun Paste.toHtml(): String = StringEscapeUtils.escapeHtml(this.text)

fun uniqueId(): Int {
    var id = randomId()
    transaction {
        while (PasteDBO.findById(id) !== null) {
            id = randomId()
        }
    }
    return id
}

fun randomId(): Int = Random.nextInt(0, 1000)