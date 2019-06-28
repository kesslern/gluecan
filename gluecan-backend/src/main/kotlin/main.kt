package us.kesslern

import io.javalin.Javalin
import io.javalin.http.Context
import org.flywaydb.core.Flyway
import org.jetbrains.exposed.dao.*
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.TransactionManager
import org.jetbrains.exposed.sql.transactions.transaction
import java.sql.Connection

fun main() {
    val adminPass = System.getProperty("gluecan.pass", "change_me")
    val database = "jdbc:sqlite:gluecan"
    val flyway = Flyway.configure().dataSource(database, "su", null).load()
    flyway.migrate()
    Database.connect(database, driver = "org.sqlite.JDBC")
    TransactionManager.manager.defaultIsolationLevel = Connection.TRANSACTION_SERIALIZABLE

    fun Context.authenticate(body: () -> Unit) {
        val authHeader = this.header("X-Auth")
        if (authHeader == adminPass) {
            body()
        } else {
            this.status(401)
        }
    }

    val app = Javalin.create { config ->
        config.addStaticFiles("/frontend")
        config.addSinglePageRoot("/", "/frontend/index.html")
    }

    app.get("/api/pastes") { ctx ->
        ctx.authenticate {
            transaction {
                ctx.dboToJson(PasteDBO.all())
            }
        }
    }

    fun template(paste: Paste) = """
        <html>
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>GlueCan #${paste.id}</title>
        <link rel="stylesheet" href="/solarized-dark.css">
        <script src="/highlight.pack.js"></script>
        <script>hljs.initHighlightingOnLoad();</script>
        <style>
          pre, body { margin: 0; padding: 0 }
          code { box-sizing: border-box; min-height: 100vh; min-width: 100vw }
        </style>
        </head>
        <body>
        <pre><code${if (paste.language != null) " class=${paste.language}" else ""}>${paste.text}</pre></code>
        </body>
        </html>
    """.trimIndent()

    app.get("/view/:id") { ctx ->
        val paste = transaction {
            val id = ctx.pathParam(":id").toInt()
            PasteDBO.findById(id)
        }

        if (paste == null) {
            ctx.result("Not found")
            ctx.status(410)
        } else {
            ctx.contentType("text/html")
            ctx.result(template(paste.toData()))
        }
    }

    app.get("/api/pastes/:id") { ctx ->
        transaction {
            val id = ctx.pathParam(":id").toInt()
            val paste = PasteDBO.findById(id)

            if (paste != null) {
                paste.views++
                ctx.dboToJson(paste)
            } else {
                ctx.status(410)
            }

        }
    }

    app.delete("/api/pastes/:id") { ctx ->
        ctx.authenticate {
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
        }
    }

    app.post("/api/pastes") { ctx ->
        ctx.authenticate {
            val id = transaction {
                PastesTable.insert {
                    it[language] = ctx.queryParam("lang")
                    it[text] = ctx.body()
                }[PastesTable.id]
            }
            ctx.result(id.value.toString())
        }
    }

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
