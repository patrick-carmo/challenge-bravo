import "dotenv/config";
import env from "./config/envConfig";
import express from "express";
import redis from "./database/redis";

import currencyRoutes from "./routes/currencyRoutes";

redis.connect();

const app = express();

app.use(express.json());

app.use(currencyRoutes);

app.listen(env.PORT, () => console.log(`Server running on port ${env.PORT}`));
