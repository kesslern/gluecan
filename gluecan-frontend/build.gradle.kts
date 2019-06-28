plugins {
    id("com.moowork.node") version "1.3.1"
    java
}

val jsBuildDir = project.buildDir.absolutePath
val jsProjectDir = project.projectDir.absolutePath
val jsSourceDir = "$jsProjectDir/src"
val jsPublicDir = "$jsProjectDir/public"
val packageJsonPath = "$jsProjectDir/package.json"

val jar by tasks.getting(Jar::class) {
    from(jsBuildDir) {
        into("/frontend")
    }
    exclude("**/*.jar")
    includeEmptyDirs = true
}

node {
    version = "10.16.0"
    yarnVersion = "1.16.0"
    download = true
}


tasks {
    val jsBuild by registering(GradleBuild::class) {
        tasks = listOf("yarn_build")
        inputs.files("src/")
        outputs.files("build/")

    }
}

tasks["jar"].dependsOn("jsBuild")
tasks["build"].dependsOn("jar")
