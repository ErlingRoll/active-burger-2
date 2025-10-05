# Load env
source ".env"

# Pull PostgreSQL image
docker image pull postgres:15

# Start PostgreSQL container
docker run --name $PG_CONTAINER_NAME -e POSTGRES_PASSWORD=$PG_PASSWORD -e POSTGRES_USER=$PG_USER -e POSTGRES_DB=$PG_DB -p 5432:5432 -d postgres:15
# Run PostgreSQL init script
cat ./pgsql_init.sql | docker exec -i $PG_CONTAINER_NAME psql -U $PG_USER -d $PG_DB

# Install nodemon for hot reload
npm install -g nodemon
