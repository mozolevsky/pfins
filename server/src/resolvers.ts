import AssetsDB from "./datasources/assets";

export const resolvers = {
  Query: {
    assets: (_, __, { assetsDB }: { assetsDB: AssetsDB }) =>
      assetsDB.getAssets(),
    asset: (_, { id }, { assetsDB }: { assetsDB: AssetsDB }) =>
      assetsDB.getAsset(id),
    assetByType: (_, { type }, { assetsDB }: { assetsDB: AssetsDB }) =>
      assetsDB.getAssetByType(type),
  },
  Mutation: {
    addAsset: (_, { asset }, { assetsDB }: { assetsDB: AssetsDB }) =>
      assetsDB.addAsset(asset),
    updateAsset: (_, { asset }, { assetsDB }: { assetsDB: AssetsDB }) =>
      assetsDB.updateAsset(asset),
    deleteAsset: (_, { id }, { assetsDB }: { assetsDB: AssetsDB }) =>
      assetsDB.deleteAsset(id),
  },
};
