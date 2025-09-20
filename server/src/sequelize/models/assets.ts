"use strict";
import { Model } from "sequelize";
export default (sequelize: any, DataTypes: any) => {
  class Assets extends Model {}
  Assets.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
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
