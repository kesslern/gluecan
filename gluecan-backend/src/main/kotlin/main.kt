package us.kesslern

import io.javalin.Javalin
import io.javalin.core.security.Role

internal enum class MyRole : Role {
    AUTHENTICATED
}

fun main() {
    initDatabase()

    val app = Javalin.create { config ->
        config.gluecanConfig()
    }

    app.gluecan()

    app.start(Config.port)
}

