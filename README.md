# SnakeShake
Load testing python application servers. Just a repo to experiment and mess around!

**Versions used**
* Docker: 27.0.3
* Docker compose: v2.28.1-desktop.1

# Setup

To run this repo, you need to create a `.env` file in the project root with the following variables:

```
POSTGRES_U={postgres admin username}
POSTGRES_PW={postgres admin password}
POSTGRES_DATABASE={postgres database name}
INFLUX_DB_USERNAME={influx db admin username}
INFLUX_DB_PW={influx db admin password}
INFLUX_DB_ADMIN_TOKEN={influx db admin token}
```