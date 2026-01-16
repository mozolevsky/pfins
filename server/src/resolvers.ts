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
    addAsset: async (
      _,
      { asset },
      { assetsDB, priceHistoryDB }: { assetsDB: AssetsDBType; priceHistoryDB: PriceHistoryDBType }
    ) => {
      if (!asset) {
        throw new Error("Asset input is required")
      }

      // TODO: fix it
      // const existingAsset = await assetsDB.getAssetByType(asset.type)
      // if (existingAsset) {
      //   throw new Error(`Asset ${asset.type} already exists`)
      // }
    
      // Add asset
      const id = Math.random().toString(36).substring(2, 15)
      const created = await assetsDB.addAsset({...asset, id})

      // Ensure new assets have initial price history
      if (created?.id && typeof created.value === 'number') {
        await priceHistoryDB.addPriceRecord(created.id, created.value)
      }

      return created
    },
    updateAsset: async (_, { asset }, { assetsDB }: { assetsDB: AssetsDBType }) => {
      const result = await assetsDB.updateAsset({ id: asset.id, value: asset.value })
      return result
    },
    deleteAsset: async (_, { id }, { assetsDB }: { assetsDB: AssetsDBType }) => {
      return await assetsDB.deleteAsset(id)
    },
    addPriceRecord: async (
      _,
      { assetId, price, timestamp },
      { priceHistoryDB, assetsDB }: { priceHistoryDB: PriceHistoryDBType; assetsDB: AssetsDBType }
    ) => {
      const record = await priceHistoryDB.addPriceRecord(assetId, price, timestamp);
      const latest = await priceHistoryDB.getLatestPrice(assetId)
      if (latest) {
        await assetsDB.setAssetValue({ id: assetId, value: latest.price })
      }
      const timestampString = record.timestamp instanceof Date 
        ? record.timestamp.toISOString()
        : new Date(record.timestamp).toISOString();
      
      return {
        ...record,
        timestamp: timestampString,
      };
    },
    updatePriceRecord: async (
      _,
      { id, price, timestamp },
      { priceHistoryDB, assetsDB }: { priceHistoryDB: PriceHistoryDBType; assetsDB: AssetsDBType }
    ) => {
      const record = await priceHistoryDB.updatePriceRecord(id, price, timestamp);
      const latest = await priceHistoryDB.getLatestPrice(record.assetId)
      if (latest) {
        await assetsDB.setAssetValue({ id: record.assetId, value: latest.price })
      }
      const timestampString = record.timestamp instanceof Date
        ? record.timestamp.toISOString()
        : new Date(record.timestamp).toISOString();

      return {
        ...record,
        timestamp: timestampString,
      };
    },
    deletePriceRecord: async (
      _,
      { id },
      { priceHistoryDB, assetsDB }: { priceHistoryDB: PriceHistoryDBType; assetsDB: AssetsDBType }
    ) => {
      const deleted = await priceHistoryDB.deletePriceRecord(id)

      const latest = await priceHistoryDB.getLatestPrice(deleted.assetId)
      if (latest) {
        await assetsDB.setAssetValue({ id: deleted.assetId, value: latest.price })
      }

      return id
    },
  },
  Asset: {
    value: async (parent, _, { priceHistoryDB }: { priceHistoryDB: PriceHistoryDBType }) => {
      if (!parent.id) return parent.value ?? null

      const latest = await priceHistoryDB.getLatestPrice(parent.id)
      if (latest) return latest.price

      return parent.value ?? null
    },
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