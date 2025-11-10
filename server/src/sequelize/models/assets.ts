"use strict";
import { Model } from "sequelize";
import type { Asset } from '../../generated/graphql-types'

export default (sequelize: any, DataTypes: any) => {
  class Assets extends Model<Asset> {
    declare id: string;
    declare type: string;
    declare value: number;
  }
    Assets.init(
      {
        id: { type: DataTypes.STRING, primaryKey: true, allowNull: false },
        type: DataTypes.STRING,
        value: DataTypes.FLOAT,
      },
      {
        sequelize,
        modelName: "Assets",
        timestamps: false,
      }
    );
  return Assets;
};
