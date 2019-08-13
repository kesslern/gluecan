package us.kesslern.migrations

import org.flywaydb.core.api.migration.BaseJavaMigration
import org.flywaydb.core.api.migration.Context

class V21__FullTextSearch : BaseJavaMigration() {
    override fun migrate(context: Context) {
        val connection = context.connection
        connection.createStatement().execute("alter table Pastes rename to OldPastes")
        connection.createStatement().execute("create virtual table PasteContent using FTS5(title, text)")
        connection.createStatement().execute("""
            create table Pastes (
                id integer primary key,
                views integer not null default 0,
                language text,
                text_id bigint not null,
                date datetime not null default (datetime('now')),
                foreign key(text_id) references PasteContent(rowid)
            )
        """.trimIndent())
        val result = connection.createStatement().executeQuery("select text, views, language, date from OldPastes")
        var index = 0
        while (result.next()) {
            index++
            val text = result.getString("text")
            val language = result.getString("language")
            val views = result.getInt("views")
            val date = result.getString("date")

            var stmt = connection.prepareStatement("insert into PasteContent (title, text) values (?, ?)")
            stmt.setString(1, null)
            stmt.setString(2, text)
            stmt.executeUpdate()

            stmt = connection.prepareStatement("insert into Pastes (views, language, text_id, date) values (?, ?, ?, ?)")
            stmt.setInt(1, views)
            stmt.setString(2, language)
            stmt.setInt(3, index)
            stmt.setString(4, date)
            stmt.executeUpdate()
        }

        connection.createStatement().execute("drop table OldPastes")
    }
}