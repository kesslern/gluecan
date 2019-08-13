package us.kesslern

import io.javalin.Javalin
import io.javalin.core.security.SecurityUtil.roles
import io.javalin.http.Context
import org.jetbrains.exposed.dao.EntityID
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.transactions.transaction

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
            ctx.result(Templater.template(paste.toData()))
        }
    }

    this.delete("/api/pastes/:id", { ctx ->
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

    this.post("/api/pastes", { ctx ->
        var id = 0
        transaction {
            id = uniqueId()
            PastesTable.insert {
                it[PastesTable.id] = EntityID(id, PastesTable)
                it[language] = ctx.queryParam("lang")
                it[text] = ctx.body()
            }[PastesTable.id]
        }
        ctx.result(id.toString())
    }, roles(MyRole.AUTHENTICATED))

    this.get("/api/testing") { ctx ->
        val result = connection.createStatement().executeQuery("select PasteContent.text, Pastes.date, Pastes.views, Pastes.language, Pastes.id from Pastes inner join PasteContent on Pastes.text_id = PasteContent.rowid")

        val pastes = mutableListOf<Paste>()
        while (result.next()) {
            val id = result.getInt("id")
            val text = result.getString("text")
            val date = result.getString("date")
            val views = result.getInt("views")
            val language = result.getString("language")
            pastes += Paste(id, views, language, text, date)
        }

        ctx.json(pastes)
    }
}