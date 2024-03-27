import { Router } from "express";
import { currencyController } from "../controllers/currencyController";
import joi from "../middlewares/requestValidation";
import { schema } from "../models/joiCurrency";

const route = Router();

route.get("/", currencyController.listCurrencies);
route.get(
    "/convert",
    joi(schema.currency),
    currencyController.convertCurrency
);

route.get(
    "/currency/:code",
    joi(schema.currency),
    currencyController.getCurrency
);

export default route;
