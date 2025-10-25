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
    addAsset: async (_, { asset }, { assetsDB }: { assetsDB: AssetsDB }) => {

      // TODO: Check if asset already exists
    

      // Add asset
      const id = Math.random().toString(36).substring(2, 15)
      const created = await assetsDB.addAsset({...asset, id})
      return created
    },
    updateAsset: async (_, { asset }, { assetsDB }: { assetsDB: AssetsDB }) => {
      const result = await assetsDB.updateAsset({ id: asset.id, value: asset.value })
      return result
    },
    deleteAsset: (_, { id }, { assetsDB }: { assetsDB: AssetsDB }) =>
      assetsDB.deleteAsset(id),
  },
}