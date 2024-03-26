import { Request, Response } from "express";
import { currencyService } from "../services/currencyService";

const listCurrencies = async (req: Request, res: Response) => {
    try {
        const currencies = await currencyService.getCurrencies();

        return res.status(200).json(currencies);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

const getCurrency = async (req: Request, res: Response) => {
    try {
        const { code } = req.query as { code: string };

        const currency = await currencyService.getCurrency(code);

        return res.status(200).json(currency);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

export const currencyController = {
    listCurrencies,
    getCurrency,
};
