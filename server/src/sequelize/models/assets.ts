"use strict";
import { Model, Optional } from "sequelize";
import { Asset } from "../../types";

type AssetCreationAttributes = Optional<Asset, "id">;

export default (sequelize: any, DataTypes: any) => {
  class Assets extends Model<Asset, AssetCreationAttributes> {
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
