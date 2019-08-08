package us.kesslern

import com.amihaiemil.eoyaml.Yaml
import com.amihaiemil.eoyaml.YamlMapping
import java.io.File

object Config {
    val adminPass: String
    val public: Boolean
    val database: String
    val keystorePath: String?
    val keystorePassword: String?
    val port: Int
    val sslPort: Int


    init {
        val yamlMapping = Yaml
            .createYamlInput(File("gluecan-config.yml"))
            .readYamlMapping()


        this.adminPass = yamlMapping.string("adminPass")
        this.database = "jdbc:sqlite:${yamlMapping.string("database")}"
        this.port = yamlMapping.string("port")!!.toInt()
        this.sslPort = yamlMapping.string("sslPort")!!.toInt()
        this.public = yamlMapping.string("public")!!.toBoolean()

        val keystore = yamlMapping.yamlMapping("keystore")
        this.keystorePath = keystore.optionalString("path")
        this.keystorePassword = keystore.optionalString("password")
    }
}

fun YamlMapping.optionalString(key: String): String? {
    val value = this.string(key)
    return if (value == "~") null else value
}