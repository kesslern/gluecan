package us.kesslern

import io.javalin.Javalin
import org.flywaydb.core.Flyway
import org.jetbrains.exposed.dao.*
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.TransactionManager
import org.jetbrains.exposed.sql.transactions.transaction
import java.sql.Connection

fun main() {
    val database = "jdbc:sqlite:gluecan"
    val flyway = Flyway.configure().dataSource(database, "su", null).load()
    flyway.migrate()
    Database.connect(database, driver = "org.sqlite.JDBC")
    TransactionManager.manager.defaultIsolationLevel = Connection.TRANSACTION_SERIALIZABLE

    val app = Javalin.create { config ->
        config.addStaticFiles("/frontend")
        config.addSinglePageRoot("/", "/frontend/index.html")
    }

    app.get("/api/hello") { it.result("Hello, world!") }

    app.get("/api/pastes") {
        transaction {
            it.json(PasteDBO.all().map(PasteDBO::toPaste))
        }
    }

    app.get("/api/pastes/:id") { ctx ->
        transaction {
            val paste = PasteDBO.findById(ctx.pathParam(":id").toInt())?.toPaste()

            if (paste != null) {
                ctx.json(paste)
            } else {
                ctx.status(410)
            }

        }
    }

    app.post("/api/pastes") {
        transaction {
            PastesTable.insert {
                it[text] = "foobar"
            }
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

class PasteDBO(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<PasteDBO>(PastesTable)

    var views by PastesTable.views
    var language by PastesTable.language
    var text by PastesTable.text
}

fun PasteDBO.toPaste() = Paste(this.id.value, this.views, this.language, this.text)

