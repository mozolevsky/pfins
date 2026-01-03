import { AssetsDBType } from "./datasources/assets";
import { Resolvers } from "./generated/graphql-types";

export const resolvers: Resolvers = {
  Query: {
    assets: (_, __, { assetsDB }: { assetsDB: AssetsDBType }) =>
      assetsDB.getAssets(),
    asset: (_, { id }, { assetsDB }: { assetsDB: AssetsDBType }) =>
      assetsDB.getAsset(id),
    assetByType: (_, { type }, { assetsDB }: { assetsDB: AssetsDBType }) =>
      assetsDB.getAssetByType(type),
  },
  Mutation: {
    addAsset: async (_, { asset }, { assetsDB }: { assetsDB: AssetsDBType }) => {

      // TODO: fix it
      // const existingAsset = await assetsDB.getAssetByType(asset.type)
      // if (existingAsset) {
      //   throw new Error(`Asset ${asset.type} already exists`)
      // }
    
      // Add asset
      const id = Math.random().toString(36).substring(2, 15)
      const created = await assetsDB.addAsset({...asset, id})
      return created
    },
    updateAsset: async (_, { asset }, { assetsDB }: { assetsDB: AssetsDBType }) => {
      const result = await assetsDB.updateAsset({ id: asset.id, value: asset.value })
      return result
    },
    deleteAsset: async (_, { id }, { assetsDB }: { assetsDB: AssetsDBType }) => {
      return await assetsDB.deleteAsset(id)
    },
  },
}