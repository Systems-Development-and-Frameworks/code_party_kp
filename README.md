# Systems Development and Frameworks - 2020/21

This is the homework repository of course `Systems Development and Frameworks` of `Kirill Prakhov und Phuong Pham und Anton Karakochev`

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
WHY
Why did we choose the Neo4J and neo4j-graphql-js? The Lyon's presentation convinced us to use and learn about this interesting technology. A similar use case like our WebApp was explained very well in the lecture and we would like to go deeper into this technology to understand how our application can look like using the graphs. It is also very interesting to see how the elements of the application depend on each other. This technology is new for all members, so we would like to explore it further. Regarding our use case: Our data can be represented very clearly with Neo4J. The data can be visualised and explored very well with Neo4J.

### Installation Instructions

#### Installing neo4j locally

1. Install neo4j by following the [installation guidelines](https://neo4j.com/docs/operations-manual/current/installation/) for your respective OS. If you are using `macOS` in combination with [homebrew](https://brew.sh/), you can just run
```bash
brew install neo4j
```
2. Once the installation has finished, you can launch neo4j via
```bash
neo4j start
```
3. Navigate to `http://localhost:7474/` to verify it is indeed running

5. create a environment config file `backend/.env` similar to the one used for testing `backend/.env.test`

6. Start the application
```bash
npm run dev
```
7. Navigate the browser to ```http://localhost:4000/```

8. Once done, the database can be stopped via  
```
neo4j stop
```
