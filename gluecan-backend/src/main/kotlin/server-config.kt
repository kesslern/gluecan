package us.kesslern

import io.javalin.core.JavalinConfig
import org.eclipse.jetty.server.Server
import org.eclipse.jetty.server.ServerConnector
import org.eclipse.jetty.server.session.SessionHandler
import org.eclipse.jetty.util.ssl.SslContextFactory
import org.slf4j.LoggerFactory

private fun getSslContextFactory(): SslContextFactory.Server {
    val sslContextFactory = SslContextFactory.Server()
    sslContextFactory.keyStorePath = Config.keystorePath
    sslContextFactory.setKeyStorePassword(Config.keystorePassword)
    return sslContextFactory
}


fun JavalinConfig.gluecanConfig() {
    val log = LoggerFactory.getLogger("config")
    this.server {
        val server = Server()

        val sslConnector = if (Config.keystorePath != null) {
            log.info("Enabling SSL")
            val sslConnector = ServerConnector(server, getSslContextFactory())
            sslConnector.port = Config.sslPort
            sslConnector
        } else null

        val connector = ServerConnector(server)
        connector.port = Config.port

        if (sslConnector != null) {
            server.connectors = arrayOf(sslConnector, connector)
        } else {
            server.connectors = arrayOf(connector)
        }

        server
    }

    this.sessionHandler {
        val handler = SessionHandler()
        handler.maxInactiveInterval = 15 * 60
        handler
    }
    this.addStaticFiles("/frontend")
    this.addSinglePageRoot("/", "/frontend/index.html")
    this.accessManager { handler, ctx, permittedRoles ->
        val authenticatedViaHeader = ctx.header("X-Auth") == Config.adminPass
        val authenticatedViaCookie = ctx.sessionAttribute<Boolean>("authenticated") == true
        val authenticated = authenticatedViaHeader || authenticatedViaCookie

        if (authenticatedViaHeader && !authenticatedViaCookie) {
            ctx.req.changeSessionId()
            ctx.sessionAttribute("authenticated", true)
        }

        if ((permittedRoles.contains(MyRole.AUTHENTICATED) && authenticated)
            || permittedRoles.size == 0
            || Config.public
        ) {
            handler.handle(ctx)
        } else {
            ctx.status(401)
        }
    }
}