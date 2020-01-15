## Setup db and user for development

```
brew install postgresql
```

```
createdb palikka
createuser palikka_user

psql

alter user palikka_user with encrypted password 'palikka123';
grant all privileges on database palikka to palikka_user;

```

Running migrations

```
npx knex migrate:latest --knexfile src/database/knexfile.ts
```
