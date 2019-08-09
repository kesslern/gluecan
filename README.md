# GlueCan

A pastebin designed for personal self-hosting.

## Build & Run Prerequisites

- Java >= 8

## Running

Download a release from [here](https://github.com/kesslern/gluecan/releases). After extraction, configure `gluecan-config.yml` and run `bin/gluecan`.

## Configuration

### Public Mode

GlueCan's pastes are always publicly viewable, but creation and deletion of pastes can be restricted. In private mode, an administration password is required to access the administration UI, delete pastes, or create new pastes.

### gluecan-config.yml

| Configuration Key | Description                                                                                                                  |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| port              | The port to listen on.                                                                                                       |
| sslPort           | The port to listen on for SSL, if used.                                                                                      |
| public            | If true, the admin interface and ability to create/delete pastes is password protected. Pastes are always publicly viewable. |
| admin_pass        | The password if running in private mode. Unused in public mode.                                                              |
| database          | Database path/filename to use.                                                                                               |
| keystore.path     | If defined, GlueCan will use the provided keystore to create a secure SSL connection.                                        |
| keystroe.path     | The keystore password to use.                                                                                                |

GlueCan will always read `gluecan-config.yml` from the current working directory.

## Development

### Prerequisites

- JDK 8+
- Node 10+
- Yarn (latest version)

### Run Locally

Invoke the `run` task with gradle wrapper to download dependencies and start GlueCan with `./gradlew run`. The configuration file at `gluecan-backend/gluecan-config.yml` will be used.

### Frontend Development

The `run` task will create a production build from `gluecan-frontend` and serve the files from the classpath. For frontend development, the yarn development server should be used.

Inside `gluecan-frontend`, run `yarn start` to start the development server at `localhost:3000`. API requests will be proxied to the backend at `localhost:8080`.

## Built With

- [Javalin](https://javalin.io/)
- [Gradle](https://gradle.org/)
- [Kotlin](https://kotlinlang.org/)
- [Material UI](https://material-ui.com/)
- [Jetty](https://www.eclipse.org/jetty/)
- [create-react-app](https://github.com/facebook/create-react-app)
- [redux-starter-kit](https://redux-starter-kit.js.org/)
- [react-router](https://reacttraining.com/react-router/)
- [highlight.js](https://highlightjs.org/)

## License

This project is licensed under the ISC License - see [LICENSE.md](LICENSE.md).
