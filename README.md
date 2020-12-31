# Systems Development and Frameworks - 2020/21

This is the homework repository of course `Systems Development and Frameworks` of `Anton Karakochev, Phuong Pham, Kirill Prakhov`

## Homework - Exercise #0

1. Find team members to groups of 2-3 people. Together, come up with a team name (Team names must be url-safe). We will setup a team on Github and Moodle for you. Kudos for a team name with a corresponding emoji.

---- Group is created with the name "code_party_kp" and the members "[Kirill Prakhov](https://github.com/kipmann) and [Phuong Pham](https://github.com/jingyophuong) and [Anton Karakochev](https://github.com/KarakoA)" -----

2. Make a copy of this repository (using a second remote). Ensure that each member of your team has sufficient access. :star:

---- ok done!!!!!! -----

3. Replace the content of this `README.md` with your individual content. Here's a Github [README.md template](https://github.com/othneildrew/Best-README-Template) and there are more [awesome READMEs](https://github.com/matiassingers/awesome-readme) out there. :star:

## Homework - Exercise #1

Implement a simple todo app with VueJS.

Each item in the todo app should:

Edit: display a form to update the todo

Save: update the todo and display it

Cancel: cancel the form submission

Delete: delete the todo

## Homework - Exercise #5
### Chosen Scenario - Neo4J and neo4j-graphql-js

#### Motivation

Why did we choose Neo4J and neo4j-graphql-js? Lyon's presentation convinced us to use and learn about this interesting technology. A similar use case like our WebApp was explained very well in the lecture and we would like to go deeper into this technology to understand how our application can look like using the graphs. It is also very interesting to see how the elements of the application depend on each other. This technology is new for all members, so we would like to explore it further. Regarding our use case: Our data can be represented very clearly with Neo4J, at the same time it also can be visualised and explored very well with Neo4J.

### Installation Instructions

We used both variants (local and with Docker). Finally, everything runs with Docker in our CI/CD GitHub Actions, but it helped a lot to do a local installation during the implementation, for example when setting up the Neo4j or testing individual methods.

#### Installing and running neo4j with docker
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
docker run -p7474:7474 -p7687:7687 -d -e NEO4J_AUTH=neo4j/NEO4J neo4j
```

4. Navigate to `http://localhost:7474/` to verify Neo4j is indeed running

5. Start the application
```bash
npm run dev
```
6. Navigate the browser to ```http://localhost:4000/```

#### Installing and running neo4j locally (alternative)

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

5. Start the application
```bash
npm run dev
```
6. Navigate the browser to ```http://localhost:4000/```

7. Once done, the database can be stopped via  
```
neo4j stop
```
