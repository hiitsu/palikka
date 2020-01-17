require("ts-node/register");

module.exports = {
  test: {
    client: "postgresql",
    connection: {
      database: "palikkatest",
      user: "palikkatest_user",
      password: "palikka123"
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations",
      directory: "./migrations"
    }
  },
  development: {
    client: "postgresql",
    connection: {
      database: "palikka",
      user: "palikka_user",
      password: "palikka123"
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations",
      directory: "./migrations"
    }
  },

  production: {
    client: "postgresql",
    connection: process.env.PG_URI,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations",
      directory: "./migrations"
    }
  }
};
