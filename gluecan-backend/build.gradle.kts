plugins {
    kotlin("jvm") version "1.3.40"
    application
}

application {
    mainClassName = "us.kesslern.MainKt"
    group = "us.kesslern"
    applicationName = "gluecan"
}

dependencies {
    implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8")
    implementation("io.javalin:javalin:3.1.0")
    implementation("org.slf4j:slf4j-simple:1.7.26")
    runtime(project(":gluecan-frontend"))
}