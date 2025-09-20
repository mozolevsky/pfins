import { Sequelize } from "sequelize";
import type { Options } from "sequelize";
import config from "./config.json";

const connectSequelize = () =>
  new Sequelize(
    config.database,
    config.username,
    config.password,
    config.options as Options
  );

export { connectSequelize };
