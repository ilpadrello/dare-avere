import fs from "fs-extra";
import { resolve } from "path";
import yaml from "js-yaml";

const path = resolve(`config/${process.env.NODE_ENV || "development"}.yaml`);
const pathUntracked = resolve(
  `config/untracked/${process.env.NODE_ENV || "development"}.yaml`
);
let config: DA.Config | undefined;
if (fs.pathExistsSync(path)) {
  config = yaml.load(fs.readFileSync(path, "utf8")) as unknown as DA.Config;
  if (fs.pathExistsSync(pathUntracked)) {
    config = {
      ...config,
      ...(fs.readFileSync(pathUntracked, "utf8") as unknown as DA.Config),
    };
  }
} else {
  throw new Error("config file not found");
}

export default config as DA.Config;
