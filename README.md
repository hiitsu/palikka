## Development environment

```
# Or with docker

brew install postgresql
brew services start postgresql


# Setup local development database:

createdb palikka
createuser palikka_user
psql -e -c "alter user palikka_user with encrypted password 'palikka123';"
psql -e -c "grant all privileges on database palikka to palikka_user;"


# Setup local test database:

createdb palikkatest
createuser palikkatest_user
psql -e -c "alter user palikkatest_user with encrypted password 'palikka123';"
psql -e -c "grant all privileges on database palikkatest to palikkatest_user;"


# Install npm packages

npm ci --engine-strict


# Running migrations:

npx knex migrate:latest --env development --knexfile src/database/knexfile.ts
npx knex migrate:latest --env test --knexfile src/database/knexfile.ts

# Run tests

npx jest

# Start development:

npm run dev-ui # http://localhost:3000/
npm run dev-api # http://localhost:3001/

```

```
# If you ever need to start fresh:

dropdb palikkatest
dropuser palikkatest_user
dropdb palikka
dropuser palikka_user
```
