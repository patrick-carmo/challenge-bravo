import env from "../config/envConfig";
import redis from "../database/redis";
import {
    Currencies,
    CurrenciesFetch,
    CurrencyFetch,
    Currency,
} from "../types/currency";
import { utilsCurrency } from "../utils/utilsCurrency";

const getCurrencies = async (): Promise<Currencies> => {
    try {
        const currenciesRedis = await redis.get(env.KEY);

        if (currenciesRedis) {
            return JSON.parse(currenciesRedis) as Currencies;
        }

        const supportedCurrencies = env.SUPPORTED_CURRENCIES;

        const response: Response = await fetch(
            "https://economia.awesomeapi.com.br/json/all"
        );
        const responseData = await response.json();

        if (!responseData) {
            throw new Error("Error fetching currencies");
        }

        const data = responseData as CurrenciesFetch;

        const filteredCurrencies: Currencies = Object.keys(data).reduce(
            (filtered: any, key: string) => {
                if (supportedCurrencies.includes(key)) {
                    const currencyFetch: CurrencyFetch = data[key];

                    filtered[key] = {
                        code: currencyFetch.code,
                        name: currencyFetch.name.split("/")[0],
                        value: utilsCurrency.formatNumber(
                            key === "USD" ? 1 : currencyFetch.bid / data.USD.bid
                        ),
                    };

                    redis
                        .set(
                            `${env.KEY}-${key}`,
                            JSON.stringify(filtered[key]),
                            {
                                EX: 60 * 10,
                            }
                        )
                        .catch(() => {
                            throw new Error("Error saving currency");
                        });
                }
                return filtered;
            },
            {}
        );

        filteredCurrencies.BRL = {
            code: "BRL",
            name: "Real",
            value: utilsCurrency.formatNumber(
                filteredCurrencies.USD.value / data.USD.bid
            ),
        };

        await redis.set(
            `${env.KEY}-BRL`,
            JSON.stringify(filteredCurrencies.BRL),
            {
                EX: 60 * 10,
            }
        );

        await redis.set(env.KEY, JSON.stringify(filteredCurrencies), {
            EX: 60 * 10,
        });

        return filteredCurrencies;
    } catch (error: any) {
        throw new Error("Error fetching currencies");
    }
};

const getCurrency = async (code: string): Promise<Currency> => {
    try {
        const currencyRedis = await redis.get(`${env.KEY}-${code}`);

        if (currencyRedis) {
            return JSON.parse(currencyRedis) as Currency;
        }

        const currencies: Currencies = await getCurrencies();

        const currency = currencies[code];

        return currency;
    } catch (error: any) {
        throw new Error("Error fetching currency");
    }
};

export const currencyService = {
    getCurrencies,
    getCurrency,
};
