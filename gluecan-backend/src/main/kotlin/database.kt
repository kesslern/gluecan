package us.kesslern

import org.apache.commons.lang.StringEscapeUtils
import org.flywaydb.core.Flyway
import java.sql.Connection
import java.sql.DriverManager
import kotlin.random.Random

var connection: Connection = DriverManager.getConnection(Config.database)

fun initDatabase() {
    val flyway = Flyway.configure().dataSource(Config.database, "su", null).locations("us.kesslern.migrations", "db.migration").load()
    flyway.migrate()
}

fun Paste.toHtml(): String = StringEscapeUtils.escapeHtml(this.text)

fun uniqueId(): Int {
    var id = randomId()
    val stmt = connection.prepareStatement("select id from Pastes where id = ?")
    stmt.setInt(1, id);
    var result = stmt.executeQuery()

    while (result.next()) {
        id = randomId()
        stmt.setInt(1, id);
        result = stmt.executeQuery()
    }
    return id
}

fun randomId(): Int = Random.nextInt(0, 1000)

data class Paste(
    val id: Int,
    val views: Int?,
    val language: String?,
    val text: String?,
    val date: String
)
