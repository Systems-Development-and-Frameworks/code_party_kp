### Installing and running the backend with neo4j in docker

1. Install docker manually

- `macOS` in combination with [homebrew](https://brew.sh/)

```bash
brew install docker
brew install virtualbox
docker-machine create --driver virtualbox default
docker-machine env default
eval "$(docker-machine env default)"
```

- alternatively you can download docker desktop from the [official website](https://www.docker.com/get-started) for your OS and just install it. All configuration will be done by the installer automatically

2. Create a environment config file `backend/.env` similar to the one used for testing `backend/.env.test`

3. Start docker with the following comand:

```bash
docker run -p 7474:7474 -p 7687:7687 -d -e NEO4J_AUTH=neo4j/NEO4J neo4j
```

4. Navigate to `http://localhost:7474/` to verify Neo4j is indeed running

5. Seed the database
```bash
npm run db:clean
npm run db:seed
```

6. Start the application

```bash
npm install
npm run dev
```

7. Navigate the browser to `http://localhost:4000/`

###  Installing and running the backend with neo4j installed locally (alternative)

1. Install neo4j by following the [installation guidelines](https://neo4j.com/docs/operations-manual/current/installation/) for your respective OS.
   `macOS` in combination with [homebrew](https://brew.sh/), you can just run

```bash
brew install neo4j
```

if you want to run on Windows, you can follow this [instruction](https://neo4j.com/docs/operations-manual/current/installation/windows/)

2. Once the installation has finished, you can launch neo4j via

```bash
neo4j start
```

3. Navigate to `http://localhost:7474/` to verify Neo4j is indeed running

4. create a environment config file `backend/.env` similar to the one used for testing `backend/.env.test`

5. Seed the database
```bash
npm run db:clean
npm run db:seed
```

6. Start the application

```bash
npm install
npm run dev
```

7. Navigate the browser to `http://localhost:4000/`

8. Once done, the database can be stopped via

```
neo4j stop
```
