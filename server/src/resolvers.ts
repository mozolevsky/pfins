import { AssetsDBType } from "./datasources/assets";
import { PriceHistoryDBType } from "./datasources/priceHistory";
import { Resolvers } from "./generated/graphql-types";

export const resolvers: Resolvers = {
  Query: {
    assets: (_, __, { assetsDB }: { assetsDB: AssetsDBType }) =>
      assetsDB.getAssets(),
    asset: (_, { id }, { assetsDB }: { assetsDB: AssetsDBType }) =>
      assetsDB.getAsset(id),
    assetByType: (_, { type }, { assetsDB }: { assetsDB: AssetsDBType }) =>
      assetsDB.getAssetByType(type),
    priceHistory: async (_, { assetId, startDate, endDate, limit }, { priceHistoryDB }: { priceHistoryDB: PriceHistoryDBType }) => {
      const history = await priceHistoryDB.getPriceHistory(assetId, startDate, endDate, limit);
      return history.map(record => {
        const timestampString = record.timestamp instanceof Date 
          ? record.timestamp.toISOString()
          : new Date(record.timestamp).toISOString();
        
        return {
          ...record,
          timestamp: timestampString,
        };
      });
    },
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
    addPriceRecord: async (_, { assetId, price, timestamp }, { priceHistoryDB }: { priceHistoryDB: PriceHistoryDBType }) => {
      const record = await priceHistoryDB.addPriceRecord(assetId, price, timestamp);
      const timestampString = record.timestamp instanceof Date 
        ? record.timestamp.toISOString()
        : new Date(record.timestamp).toISOString();
      
      return {
        ...record,
        timestamp: timestampString,
      };
    },
  },
  Asset: {
    priceHistory: async (parent, { startDate, endDate, limit }, { priceHistoryDB }: { priceHistoryDB: PriceHistoryDBType }) => {
      if (!parent.id) return [];
      
      const history = await priceHistoryDB.getPriceHistory(parent.id, startDate, endDate, limit);
      
      return history.map(record => {
        const timestampString = record.timestamp instanceof Date 
          ? record.timestamp.toISOString()
          : new Date(record.timestamp).toISOString();
        
        return {
          ...record,
          timestamp: timestampString,
        };
      });
    },
  },
}