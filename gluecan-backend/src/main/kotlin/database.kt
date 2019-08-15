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

fun getPasteText(id: Int): String? {
    val stmt =
        connection.prepareStatement("select PasteContent.text from Pastes inner join PasteContent on Pastes.text_id = PasteContent.rowid where Pastes.id = ?")
    stmt.setInt(1, id)
    val result = stmt.executeQuery()

    return if (result.next()) {
        result.getString("text")
    } else null
}

fun getAllPastes(): List<Paste> {
    val result = connection.createStatement().executeQuery("select Pastes.date, Pastes.views, Pastes.language, Pastes.id from Pastes")

    val pastes = mutableListOf<Paste>()
    while (result.next()) {
        val id = result.getInt("id")
        val date = result.getString("date")
        val views = result.getInt("views")
        val language = result.getString("language")
        pastes += Paste(id, views, language, null, date)
    }
    return pastes
}

fun getPaste(id: Int): Paste? {
    val retrieveStatement = connection.prepareStatement("select PasteContent.text, Pastes.date, Pastes.views, Pastes.language from Pastes inner join PasteContent on Pastes.text_id = PasteContent.rowid where Pastes.id = ?")
    retrieveStatement.setInt(1, id)
    val result = retrieveStatement.executeQuery()

    return if (result.next()) {
        val text = result.getString("text")
        val date = result.getString("date")
        val views = result.getInt("views")
        val language = result.getString("language")
        Paste(id, views, language, text, date)
    } else {
        null
    }
}

fun deletePaste(id: Int): Boolean {
    val stmt = connection.prepareStatement("delete from PasteContent where rowid=(select text_id from Pastes where id=?)")
    stmt.setInt(1, id)
    val result = stmt.executeUpdate()

    return if (result > 0) {
        val stmt2 = connection.prepareStatement("delete from Pastes where id=?")
        stmt2.setInt(1, id)
        stmt2.executeUpdate()
        true
    } else {
        false
    }
}

fun createPaste(text: String, language: String?): Int {
    val id =  uniqueId()
    var stmt = connection.prepareStatement("insert into PasteContent(text) values (?)")
    stmt.setString(1, text)
    stmt.executeUpdate()

    stmt = connection.prepareStatement("insert into Pastes(id, text_id, language) values(?, last_insert_rowid(), ?)")
    stmt.setInt(1, id)
    stmt.setString(2, language)
    stmt.executeUpdate()
    return id
}

fun updateViewCount(id: Int) {
    val updateStatement = connection.prepareStatement("update Pastes set views = views + 1 where id = ?")
    updateStatement.setInt(1, id)
    updateStatement.execute()
}

data class Paste(
    val id: Int,
    val views: Int?,
    val language: String?,
    val text: String?,
    val date: String
)
