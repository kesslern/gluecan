# GlueCan

A pastebin designed for easy self-hosting and personal use.

## Running

### Binary Release

Download a Linux binary from [here](https://github.com/kesslern/gluecan/releases). After extraction, configure `gluecan-config.yml` and run `bin/gluecan`. Requires Java >= 8.

### Docker

Docker images are published at [kesslern/gluecan](https://cloud.docker.com/repository/docker/kesslern/gluecan). To use the docker image:

- Make your copy of `gluecan-config.yml` available on a volume
- Set the environment variable `GLUECAN_CONFIG_PATH` to the full path of the configuration file
- In the configuration file, be sure the database path points to an external volume. If not, the database will be erased when the docker updates.

For example: `docker run -v /directory/with/config/file/:/config -e GLUECAN_CONFIG_PATH=/config/gluecan-config.yml -p 8080:8080 kesslern/gluecan:latest`

## Gluecan Configuration

### Public Mode

GlueCan's pastes are always publicly viewable, but creation and deletion of pastes can be restricted. In private mode, an administration password is required to access the administration UI, delete pastes, or create new pastes.

### Configuration Location

By default, `gluecan-config.yml` is loaded from the current working directory. If the environment variable `GLUECAN_CONFIG_PATH` is defined, that value is used instead.

### gluecan-config.yml

There is an [example](../master/gluecan-backend/gluecan-config.yml) in the repository.

| Configuration Key | Description                                                                           |
| ----------------- | ------------------------------------------------------------------------------------- |
| port              | The port to listen on.                                                                |
| sslPort           | The port to listen on for SSL, if used.                                               |
| public            | If true, GlueCan is public and anyone can create or delete pastes.                    |
| admin_pass        | THE password if running in private mode. Unused in public mode.                       |
| database          | Database path/filename to use.                                                        |
| keystore.path     | If defined, GlueCan will use the provided keystore to create a secure SSL connection. |
| keystore.password | The keystore password to use.                                                         |

## SSL Warning

GlueCan uses clipboard APIs which are only available when runnig in a sceure context (HTTPS or localhost). Outside of a secure context, some GlueCan functionality will not work, and there is no graceful fallback.

## Development

### Prerequisites

- JDK 8+
- Node 10+
- Yarn (latest version)

### Run Locally

Start the server with `./gradlew run`. The configuration file at `gluecan-backend/gluecan-config.yml` will be used.

### Frontend Development

`./gradlew run` will create a production build from `gluecan-frontend` and serve the files from the classpath. For frontend development, the yarn development server should be used for better debugging, error reporting, and hot module reloading.

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
