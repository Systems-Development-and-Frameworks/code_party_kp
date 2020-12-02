//login(email: String!, password: String!): ->
// DB: get Id by Email
// DB: get hash by ID
// PWUtils: compare hash of input and DB hash
// [if equal]
// JWT Generator: generate JWT with payload(ID) and iat
// return JWT

// signup(name: String!, email: String!, password: String!): String
// DB: check email valid
// PWUtils: check pw length
// PWUtils: hash PW
//JWT Generator: generate JWT with payload(ID) and iat

//(Name, Email) PW + U ->
