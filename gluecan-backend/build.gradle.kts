plugins {
    kotlin("jvm") version "1.3.40"
    application
}

application {
    mainClassName = "us.kesslern.MainKt"
    group = "us.kesslern"
    applicationName = "gluecan"

    val pass = System.getProperty("gluecan.pass")
    if (pass != null) {
        applicationDefaultJvmArgs = listOf("-Dgluecan.pass=$pass")
    }

}

dependencies {
    implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8")
    implementation("io.javalin:javalin:3.1.0")
    implementation("org.slf4j:slf4j-simple:1.7.26")
    implementation("org.flywaydb:flyway-core:5.2.4")
    implementation("org.xerial:sqlite-jdbc:3.28.0")
    implementation("org.jetbrains.exposed:exposed:0.15.1")
    implementation("com.fasterxml.jackson.core:jackson-databind:2.9.9")
    runtime(project(":gluecan-frontend"))
}