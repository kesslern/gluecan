package us.kesslern

import io.javalin.Javalin
import io.javalin.core.security.SecurityUtil.roles
import io.javalin.http.Context

object Templater {
    fun template(paste: Paste): String {
        return javaClass
            .getResource("/template.html")
            .readText()
            .replace("{{pasteId}}", paste.id.toString())
            .replace("{{class}}", paste.language ?: "")
            .replace("{{date}}", paste.date)
            .replace("{{pasteHtml}}", paste.toHtml())

    }
}

fun viewRaw(ctx: Context) {
    val id = ctx.pathParam(":id").toInt()
    val stmt = connection.prepareStatement("select PasteContent.text from Pastes inner join PasteContent on Pastes.text_id = PasteContent.rowid where Pastes.id = ?")
    stmt.setInt(1, id)

    val result = stmt.executeQuery()

    if (result.next()) {
        ctx.contentType("text/plain")
        ctx.result(result.getString("text"))
    } else {
        ctx.result("Not found")
        ctx.status(410)
    }
}

fun Javalin.gluecan() {
    this.get("/api/pastes", { ctx ->
        val result = connection.createStatement().executeQuery("select Pastes.date, Pastes.views, Pastes.language, Pastes.id from Pastes")

        val pastes = mutableListOf<Paste>()
        while (result.next()) {
            val id = result.getInt("id")
            val date = result.getString("date")
            val views = result.getInt("views")
            val language = result.getString("language")
            pastes += Paste(id, views, language, null, date)
        }

        ctx.json(pastes)
    }, roles(MyRole.AUTHENTICATED))

    this.get("/api/pastes/:id/raw", ::viewRaw)
    this.get("/view/:id/raw", ::viewRaw)


    this.get("/view/:id") { ctx ->
        val id = ctx.pathParam(":id").toInt()

        val updateStatement = connection.prepareStatement("update Pastes set views = views + 1 where id = ?")
        updateStatement.setInt(1, id)
        updateStatement.execute()

        val retrieveStatement = connection.prepareStatement("select PasteContent.text, Pastes.date, Pastes.views, Pastes.language from Pastes inner join PasteContent on Pastes.text_id = PasteContent.rowid where Pastes.id = ?")
        retrieveStatement.setInt(1, id)
        val result = retrieveStatement.executeQuery()

        if (result.next()) {
            val text = result.getString("text")
            val date = result.getString("date")
            val views = result.getInt("views")
            val language = result.getString("language")
            ctx.contentType("text/html")
            ctx.result(Templater.template(Paste(id, views, language, text, date)))
        } else {
            ctx.result("Not found")
            ctx.status(410)
        }
    }

    this.delete("/api/pastes/:id", { ctx ->
        val id = ctx.pathParam(":id").toInt()

        val stmt = connection.prepareStatement("delete from PasteContent where rowid=(select text_id from Pastes where id=?)")
        stmt.setInt(1, id)
        val result = stmt.executeUpdate()

        if (result > 0) {
            val stmt2 = connection.prepareStatement("delete from Pastes where id=?")
            stmt2.setInt(1, id)
            stmt2.executeUpdate()
            ctx.status(200)
        } else {
            ctx.status(410)
        }
    }, roles(MyRole.AUTHENTICATED))

    this.post("/api/pastes", { ctx ->
        val id =  uniqueId()
        val text = ctx.body()
        val language = ctx.queryParam("lang")

        var stmt = connection.prepareStatement("insert into PasteContent(text) values (?)")
        stmt.setString(1, text)
        stmt.executeUpdate()

        stmt = connection.prepareStatement("insert into Pastes(id, text_id, language) values(?, last_insert_rowid(), ?)")
        stmt.setInt(1, id)
        stmt.setString(2, language)
        stmt.executeUpdate()

        ctx.result(id.toString())
    }, roles(MyRole.AUTHENTICATED))
}