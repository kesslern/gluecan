package us.kesslern

import com.fasterxml.jackson.annotation.JsonIgnore
import io.javalin.Javalin
import org.flywaydb.core.Flyway
import org.jetbrains.exposed.dao.*
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.TransactionManager
import org.jetbrains.exposed.sql.transactions.transaction
import us.kesslern.Pastes.language
import us.kesslern.Pastes.text
import us.kesslern.Pastes.views
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
            // it.json(Pastes.selectAll().map(ResultRow::toPaste))
            it.json(Pastes.select {  Pastes.id eq 2 }.first().toPaste())
        }
    }

    app.post("/api/pastes") {
        transaction {
            Pastes.insert {
                it[text] = "foobar"
            }
        }
    }

    app.start(8080)
}

data class RawPaste(
    val id: Int,
    val views: Int?,
    val language: String?,
    val text: String
)

object Pastes : IntIdTable() {
    val views = integer("views")
    val language = text("language")
    val text = text("text")
}

fun ResultRow.toPaste() = RawPaste(this[views], this[language], this[text])
