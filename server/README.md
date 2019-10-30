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

    Work with auth
    
1) POST to `/authorize` with creds (they are in middleware) and get the token
2) Save it somewhere in cookies
3) Per each request add Authorization header
`(KEY) Authorization - (VALUE) Bearer:TOKEN_HERE`
Implement gotenv

Create .env file in server root directory

Set relevant key values(see .env.example)

For additional info look at github.com/subosito/gotenv
