package us.kesslern

import io.javalin.Javalin

fun main() {
    val app = Javalin.create { config ->
        config.addStaticFiles("/frontend")
        config.addSinglePageRoot("/", "/frontend/index.html")
    }.start(8080)

    app.get("/api/hello") { it.result("Hello, world!") }
}

