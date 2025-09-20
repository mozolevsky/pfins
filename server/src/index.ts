import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import typeDefs from "./schema";
import { resolvers } from "./resolvers";
import AssetsDB from "./datasources/assets";

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
