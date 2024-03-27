import env from "../config/envConfig";
import redis from "../database/redis";
import knex from "../database/postgres";
import { CurrencyFetch, Currency, ConversionInfo } from "../types/currency";
import { utilsCurrency } from "../utils/utilsCurrency";

const getSupportedCurrencies = async (): Promise<string[]> => {
    try {
        const supportedCurrencies = await redis.get(`${env.KEY}-supported`);

        if (supportedCurrencies) {
            return JSON.parse(supportedCurrencies);
        }

        const currencies = await knex<Currency>("currency")
            .select("code")
            .then((data) => data.map((currency) => currency.code));

        if (currencies.length) {
            utilsCurrency.insertCurrencyOnRedis(`${env.KEY}-supported`, currencies);
            return currencies;
        }

        return currencies;
    } catch (error: any) {
        throw new Error("Error fetching supported currencies");
    }
};

const getCurrencies = async (): Promise<Currency[]> => {
    try {
        const currenciesRedis = await redis.get(env.KEY);
        await redis.del(env.KEY);
        if (currenciesRedis) {
            return JSON.parse(currenciesRedis) as Currency[];
        }

        const supportedCurrencies = await getSupportedCurrencies();

        const response: Response = await fetch(
            "https://economia.awesomeapi.com.br/json/all"
        );
        const responseData = await response.json();

        if (!responseData) {
            throw new Error("Error fetching currencies");
        }

        const data = responseData as { [key: string]: CurrencyFetch };

        const filteredCurrencies: Currency[] = utilsCurrency.processAndStoreCurrencies(data, supportedCurrencies);

        utilsCurrency.insertCurrencyOnRedis(env.KEY, filteredCurrencies);

        return filteredCurrencies;
    } catch {
        throw new Error("Error fetching currencies");
    }
};

const getCurrency = async (code: string): Promise<Currency> => {
    try {
        const currencyRedis = await redis.get(`${env.KEY}-${code}`);

        if (currencyRedis) {
            return JSON.parse(currencyRedis) as Currency;
        }

        const currencies: Currency[] = await getCurrencies();

        const currency = currencies.find((currency) => currency.code === code);

        if (!currency) {
            throw new Error("Currency not found");
        }

        return currency;
    } catch {
        throw new Error("Error fetching currency");
    }
};

const getConversion = async (
    from: string,
    to: string,
    amount: number
): Promise<ConversionInfo> => {
    try {
        const currencyFrom = await getCurrency(from);
        const currencyTo = await getCurrency(to);

        const conversion = (currencyFrom.value / currencyTo.value) * amount;

        const conversionInfo: ConversionInfo = {
            from,
            to,
            amount,
            conversion: `${conversion} ${to}`,
        };

        return conversionInfo;
    } catch {
        throw new Error("Error fetching conversion");
    }
};

export const currencyService = {
    getCurrencies,
    getCurrency,
    getConversion,
    getSupportedCurrencies,
};
