import config from "config";

// config.get para cada variável só acontece 1 vez
const PORT = config.get("PORT");
const NODE_ENV = config.get("NODE_ENV");

export { PORT, NODE_ENV }