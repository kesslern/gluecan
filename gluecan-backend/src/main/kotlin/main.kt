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
            it.dboToJson(PasteDBO.all())
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

    app.post("/api/pastes") { ctx ->
        val id = transaction {
            PastesTable.insert {
                it[text] = ctx.body()
            }[PastesTable.id]
        }
        ctx.result(id.value.toString())
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
