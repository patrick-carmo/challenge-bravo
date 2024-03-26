import { Router } from "express";
import { currencyController } from "../controllers/currencyController";
import redis from "../database/redis";
import env from "../config/envConfig";

const route = Router();

route.get("/currencies", currencyController.listCurrencies);

route.get("/currency", currencyController.getCurrency);

export default route;
