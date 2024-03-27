import { Request, Response } from "express";
import { currencyService } from "../services/currencyService";
import { ConversionInfo } from "../types/currency";

const listCurrencies = async (_: Request, res: Response) => {
    try {
        const currencies = await currencyService.getCurrencies();

        return res.status(200).json(currencies);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

const getCurrency = async (req: Request, res: Response) => {
    const { code } = req.params;
    const uppercaseCode = code.toUpperCase();

    try {

        const supportedCurrencies = await currencyService.getSupportedCurrencies();

        if (!supportedCurrencies.includes(uppercaseCode)) {
            return res
                .status(400)
                .json({ message: "The currency is not supported" });
        }

        const currency = await currencyService.getCurrency(uppercaseCode);

        return res.status(200).json(currency);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

const convertCurrency = async (req: Request, res: Response) => {
    const { from, to, amount } = req.query as unknown as {
        from: string;
        to: string;
        amount: number;
    };

    const uppercaseFrom = from.toUpperCase();
    const uppercaseTo = to.toUpperCase();

    try {
        const supportedCurrencies =
            await currencyService.getSupportedCurrencies();

        if (!supportedCurrencies.includes(uppercaseFrom)) {
            return res
                .status(400)
                .json({ message: "The currency from is not supported" });
        }

        if (!supportedCurrencies.includes(uppercaseTo)) {
            return res
                .status(400)
                .json({ message: "The currency to is not supported" });
        }

        const conversion: ConversionInfo = await currencyService.getConversion(
            uppercaseFrom,
            uppercaseTo,
            amount
        );

        return res.status(200).json(conversion);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

export const currencyController = {
    listCurrencies,
    getCurrency,
    convertCurrency,
};
