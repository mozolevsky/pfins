import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

const typeDefs = `#graphql
  type Asset {
    type: String
    value: Int
  }

  type Query {
    assets: [Asset]
  }
`;

const mockedAssets = [
  { type: "Cash", value: 1000 },
  { type: "Stock", value: 2000 },
  { type: "Real Estate", value: 3000 },
];

const resolvers = {
  Query: {
    assets: () => mockedAssets,
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀 Server ready at ${url}`);
