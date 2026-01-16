"use strict";
import { Model } from "sequelize";

export default (sequelize: any, DataTypes: any) => {
  class AssetPriceHistory extends Model {
    declare id: number;
    declare assetId: string;
    declare price: number;
    declare timestamp: Date;
  }
  
  AssetPriceHistory.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      assetId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: 'Assets',
          key: 'id',
        },
        onDelete: 'CASCADE', // If asset is deleted, delete its history
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "AssetPriceHistory",
      timestamps: false, // We use custom timestamp field
      indexes: [
        {
          fields: ['assetId', 'timestamp'], // Composite index for efficient queries
        },
        {
          fields: ['timestamp'], // Index for time-range queries
        },
      ],
    }
  );
  
  return AssetPriceHistory;
};
