import { GraphQLServer } from 'graphql-yoga'
import { ContextParameters } from 'graphql-yoga/dist/types'
//import { rule, shield, and, or, not } from 'graphql-shield'
const { rule, shield, and, or, not, deny, allow } = require('graphql-shield');
const jwtService = require('.backend/jwt/service');


//TODO
/*const isAuthenticated = rule({ cache: 'contextual' })(
    async (parent, args, ctx, info) => {
        return ctx.user !== null
    },
)

const isAdmin = rule({ cache: 'contextual' })(
    async (parent, args, ctx, info) => {
        return ctx.user.role === 'admin'
    },
)

const isEditor = rule({ cache: 'contextual' })(
    async (parent, args, ctx, info) => {
        return ctx.user.role === 'editor'
    },
)


// Permissions

const permissions = shield({
    Query: {
        frontPage: not(isAuthenticated),
        fruits: and(isAuthenticated, or(isAdmin, isEditor)),
        customers: and(isAuthenticated, isAdmin),
    },
    Mutation: {
        addFruitToBasket: isAuthenticated,
    },
    Fruit: isAuthenticated,
    Customer: isAdmin,
})


module.exports = permissions;*/