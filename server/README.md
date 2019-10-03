`cd ./server`

`go get ...`

`go build` inside the root 

run `./server` - will be served on `localhost:8080`

DB init

Create user and schema for the work

`sudo su`

`su - postgres`

`psql`

`CREATE DATABASE school;`

`CREATE USER school PASSWORD 'eliftech';`

`GRANT ALL PRIVILEGES ON DATABASE school TO school;`

`\q`