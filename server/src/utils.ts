import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const readFile = (path: string) => {
  return readFileSync(join(__dirname, path), {
    encoding: "utf-8",
  });
};