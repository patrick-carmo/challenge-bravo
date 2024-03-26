export type CurrencyFetch = {
  code: string;
  codein: string;
  name: string;
  high: number;
  low: number;
  varBid: number;
  pctChange: number;
  bid: number;
  ask: number;
  timestamp: string;
  create_date: string;
}

export type CurrenciesFetch = {
  [key: string]: CurrencyFetch
}

export type Currency = {
  name: string
  code: string
  value: number
}

export type Currencies = {
  [key: string]: Currency
}