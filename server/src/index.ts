import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { resolvers } from "./resolvers";
import AssetsDB from "./datasources/assets";
import { readFile } from "./utils";

const typeDefs = readFile("schema.graphql");

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async () => {
    return {
      assetsDB: new AssetsDB(),
    };
  },
});

console.log(`🚀 Server ready at ${url}`);
