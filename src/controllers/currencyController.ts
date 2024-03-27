import { Request, Response } from "express";
import { currencyService } from "../services/currencyService";
import { Conversion, Currency } from "../types/currency";

const listCurrencies = async (_: Request, res: Response) => {
    try {
        const currencies = await currencyService.getCurrencies();

        return res.status(200).json(currencies);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

const getCurrency = async (req: Request, res: Response) => {
    const code = (req.params.code as string).toUpperCase();

    try {
        const supportedCurrencies =
            await currencyService.getSupportedCurrencies();

        if (!supportedCurrencies.includes(code)) {
            return res
                .status(400)
                .json({ message: "The currency is not supported" });
        }

        const currency = await currencyService.getCurrency(code);

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

        const data: Conversion = {
            from: uppercaseFrom,
            to: uppercaseTo,
            amount,
        };

        const conversion: Conversion = await currencyService.getConversion(
            data
        );

        return res.status(200).json(conversion);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

const createCurrency = async (req: Request, res: Response) => {
    const { code, name, value }: Currency = req.body;

    const currency: Currency = {
        code: code.toUpperCase(),
        name,
        value,
    };

    try {
        await currencyService.createCurrency(currency);

        return res.status(201).json(currency);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

const updateCurrency = async (req: Request, res: Response) => {
    const { code, name, value }: Currency = req.body;
    const codeParams = (req.params.code as string).toUpperCase();

    const currency: Currency = {
        code: code.toUpperCase(),
        name,
        value,
    };

    try {
        await currencyService.updateCurrency(codeParams, currency);

        return res.status(204).send();
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

const deleteCurrency = async (req: Request, res: Response) => {
    const code = (req.params.code as string).toUpperCase();

    try {
        await currencyService.deleteCurrency(code);

        return res.status(204).send();
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

export const currencyController = {
    listCurrencies,
    getCurrency,
    convertCurrency,
    createCurrency,
    updateCurrency,
    deleteCurrency,
};
