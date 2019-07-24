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

class Templater() {
    fun template(paste: Paste): String {
        return javaClass
            .getResource("/template.html")
            .readText()
            .replace("{{pasteHtml}}", paste.toHtml())
            .replace("{{class}}", paste.language ?: "")
    }
}

fun main() {
    val templater = Templater()
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
            ctx.result(templater.template(paste.toData()))
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