package us.kesslern

import io.javalin.http.Context
import org.apache.commons.lang.StringEscapeUtils
import org.flywaydb.core.Flyway
import org.jetbrains.exposed.dao.EntityID
import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.IntEntityClass
import org.jetbrains.exposed.dao.IntIdTable
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.transactions.TransactionManager
import java.sql.Connection
import kotlin.random.Random

fun initDatabase() {
    val flyway = Flyway.configure().dataSource(Config.database, "su", null).load()
    flyway.migrate()
    Database.connect(Config.database, driver = "org.sqlite.JDBC")
    TransactionManager.manager.defaultIsolationLevel = Connection.TRANSACTION_SERIALIZABLE
}

fun Paste.toHtml(): String = StringEscapeUtils.escapeHtml(this.text)

fun uniqueId(): Int {
    var id = randomId()
    while (PasteDBO.findById(id) !== null) {
        id = randomId()
    }
    return id
}

fun randomId(): Int = Random.nextInt(0, 1000)

fun Context.dboToJson(it: DBOToData<*>) = this.json(it.toData()!!)

fun Context.dboToJson(it: Iterable<DBOToData<*>>) = this.json(it.map { it.toData() })

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
