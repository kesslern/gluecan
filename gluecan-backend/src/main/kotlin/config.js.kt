package us.kesslern

object Config {
    val adminPass = System.getProperty("gluecan.pass", "change_me")
    val public = System.getProperty("gluecan.public", "false").toLowerCase() == "true"
    val database = "jdbc:sqlite:gluecan"
    val keystorePath: String? = System.getProperty("gluecan.keystorePath")
    val keystorePassword: String? = System.getProperty("gluecan.keystorePassword")
}