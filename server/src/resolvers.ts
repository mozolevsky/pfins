import AssetsDB from "./datasources/assets";

export const resolvers = {
  Query: {
    assets: (_, __, { assetsDB }: { assetsDB: AssetsDB }) =>
      assetsDB.getAssets(),
  },
};
