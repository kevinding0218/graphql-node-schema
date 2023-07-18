const { ApolloServer, gql } = require("apollo-server");
const { ApolloServerPluginLandingPageGraphQLPlayground } = require('apollo-server-core');
const { MockList } = require('@graphql-tools/mock');


/**
 * 
 * query
 * query ExampleQuery {
    totalDays
    allDays {
      id
      date
      tech
      condition
    }
  }
 * removeDay
  mutation RemoveDay($removeDayId: ID!) {
    removeDay(id: $removeDayId) {
      id
      date
    }
  }
  & variables:
  {
    "removeDayId": "3"
  }  
 * 
 * addDay
  mutation($input: AddDayInput!) {
    addDay(input: $input) {
      id
    }
  }
  & variables:
  {
    "input": {
      "date": "07/17/2023",
      "tech": "GraphQL"
    }
  }

  * subscription
  * subscription {
  *   newDay {
  *     date
  *   }
  * }
 */
const typeDefs = gql`
  scalar Date

  """
  An object that describes the characteristics of a GraphQL Day
  """
  type GraphQLDay {
    "A GraphQL day's unique identifier"
    id: ID!
    "The date that a GraphQL day occurs"
    date: Date!
    "The tech skill a GraphQL day involves"
    tech: String!
    condition: Condition
  }

  enum Condition {
    POWDER
    HEAVY
    ICE
    THIN
  }

  type Query {
    totalDays: Int!
    allDays: [GraphQLDay!]!
  }

  input AddDayInput {
    date: Date!
    tech: String!
    condition: Condition
  }

  type RemoveDayPayload {
    day: GraphQLDay!
    removed: Boolean
    totalBefore: Int
    totalAfter: Int
  }

  type Mutation {
    addDay(input: AddDayInput!): GraphQLDay
    removeDay(id: ID!): RemoveDayPayload!
  }

  type Subscription {
    newDay: GraphQLDay!
  }
`;

const mocks = {
  Date: () => "07/17/2023",
  String: () => "Cool Mock Data",
  Query: () => ({
    allDays: () => new MockList([1, 8])
  })
}

const resolvers = {

};

const server = new ApolloServer({
  typeDefs,
  // mocks: true,
  mocks,
  plugins: [
    ApolloServerPluginLandingPageGraphQLPlayground(),
  ]
})

server
  .listen()
  .then(({ url }) =>
    console.log(`Server running at ${url} `)
  );