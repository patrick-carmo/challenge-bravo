import env_var from "env-var";

const env = {
    REDIS_HOST: env_var.get("REDIS_HOST").required().asString(),
    REDIS_PASSWORD: env_var.get("REDIS_PASSWORD").required().asString(),
    REDIS_PORT: env_var.get("REDIS_PORT").required().asInt(),
    PORT: env_var.get("PORT").required().asInt(),
    KEY: env_var.get("KEY").required().asString(),
    SUPPORTED_CURRENCIES: env_var
        .get("SUPPORTED_CURRENCIES")
        .required()
        .asArray(),
};

export default env;
