import { Currency, CurrencyFetch } from "./../types/currency";
import knex from "../database/postgres";
import redis from "../database/redis";
import env from "../config/envConfig";

const formatNumber = (value: number): number => {
    const index = value.toString().search("[1-9]");
    const formatted = value.toFixed(index === -1 ? 0 : index + 4);
    return Number(formatted);
};

const processAndStoreCurrencies = (
    data: { [key: string]: CurrencyFetch },
    supportedCurrencies: string[]
): Currency[] => {
    const filteredCurrencies: Currency[] = Object.keys(data).reduce(
        (filtered: Currency[], key: string) => {
            if (supportedCurrencies.includes(key)) {
                const currencyFetch: CurrencyFetch = data[key];

                const currency: Currency = {
                    code: currencyFetch.code,
                    name: currencyFetch.name.split("/")[0],
                    value: utilsCurrency.formatNumber(
                        key === "USD"
                            ? 1
                            : Number(currencyFetch.bid / data.USD.bid)
                    ),
                };

                filtered.push(currency);

                utilsCurrency.insertCurrencyOnDb(currency);
                utilsCurrency.insertCurrencyOnRedis(
                    `${env.KEY}-${key}`,
                    currency
                );
            }
            return filtered;
        },
        []
    );

    const brlCurrency: Currency = {
        code: "BRL",
        name: "Real",
        value: utilsCurrency.formatNumber(1 / data.USD.bid),
    };
    utilsCurrency.insertCurrencyOnDb(brlCurrency);

    filteredCurrencies.push(brlCurrency);
    utilsCurrency.insertCurrencyOnRedis(`${env.KEY}-BRL`, brlCurrency);

    return filteredCurrencies;
};

const insertCurrencyOnDb = async (currency: Currency): Promise<void> => {
    const data = await knex<Currency>("currency")
        .select("code")
        .where({ code: currency.code });

    if (data.length) {
        await knex<Currency>("currency")
            .update(currency)
            .where({ code: currency.code });

        return;
    }

    await knex<Currency>("currency").insert(currency);

    return;
};

const insertCurrencyOnRedis = async (key: string, data: any): Promise<void> => {
    await redis.set(key, JSON.parse(data), { EX: 60 * 10 });
};

export const utilsCurrency = {
    formatNumber,
    insertCurrencyOnDb,
    insertCurrencyOnRedis,
    processAndStoreCurrencies,
};
