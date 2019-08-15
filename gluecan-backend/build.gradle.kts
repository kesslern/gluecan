plugins {
    kotlin("jvm") version "1.3.40"
    application
    distribution
}

application {
    mainClassName = "us.kesslern.MainKt"
    group = "us.kesslern"
    applicationName = "gluecan"


    val args = mutableListOf<String>()
    val pass = System.getProperty("gluecan.pass")
    val public = System.getProperty("gluecan.public")
    val keystorePath = System.getProperty("gluecan.keystorePath")
    val keystorePassword = System.getProperty("gluecan.keystorePassword")
    
    if (pass != null) {
        args += "-Dgluecan.pass=$pass"
    }

    if (public != null) {
        args += "-Dgluecan.public=$public"
    }

    if (keystorePath != null) {
        args += "-Dgluecan.keystorePath=$keystorePath"
    }

    if (keystorePassword != null) {
        args += "-Dgluecan.keystorePassword=$keystorePassword"
    }

    applicationDefaultJvmArgs = args
}

dependencies {
    implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8")
    implementation("io.javalin:javalin:3.1.0")
    implementation("org.slf4j:slf4j-simple:1.7.26")
    implementation("org.flywaydb:flyway-core:5.2.4")
    implementation("org.xerial:sqlite-jdbc:3.28.0")
    implementation("com.fasterxml.jackson.core:jackson-databind:2.9.9")
    implementation("commons-lang:commons-lang:2.6")
    implementation("com.amihaiemil.web:eo-yaml:2.0.1")
    runtime(project(":gluecan-frontend"))
}


distributions {
    main {
        contents {
            from("./gluecan-config.yml")
        }
    }
}