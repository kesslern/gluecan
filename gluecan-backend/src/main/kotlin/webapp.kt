package us.kesslern

import io.javalin.Javalin
import io.javalin.core.security.SecurityUtil.roles
import io.javalin.http.Context
import org.apache.commons.lang.StringEscapeUtils

fun Paste.toHtml(): String = StringEscapeUtils.escapeHtml(this.text)

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
    val text = getPasteText(id)

    if (text !== null) {
        ctx.contentType("text/plain")
        ctx.result(text)
    } else {
        ctx.result("Not found")
        ctx.status(410)
    }
}

fun Javalin.gluecan() {
    this.get("/api/pastes", { ctx ->
        ctx.json(getAllPastes())
    }, roles(MyRole.AUTHENTICATED))

    this.get("/api/pastes/:id/raw", ::viewRaw)
    this.get("/view/:id/raw", ::viewRaw)


    this.get("/view/:id") { ctx ->
        val id = ctx.pathParam(":id").toInt()

        updateViewCount(id)
        val paste = getPaste(id)

        if (paste !== null) {
            ctx.contentType("text/html")
            ctx.result(Templater.template(paste))
        } else {
            ctx.result("Not found")
            ctx.status(410)
        }
    }

    this.delete("/api/pastes/:id", { ctx ->
        val id = ctx.pathParam(":id").toInt()

        if (deletePaste(id)) {
            ctx.status(200)
        } else {
            ctx.status(410)
        }
    }, roles(MyRole.AUTHENTICATED))

    this.post("/api/pastes", { ctx ->
        val text = ctx.body()
        val language = ctx.queryParam("lang")

        ctx.result(createPaste(text, language).toString())
    }, roles(MyRole.AUTHENTICATED))
}