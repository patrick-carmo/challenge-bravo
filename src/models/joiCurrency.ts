import joi from "joi";

const currency = joi
    .object({
        params: joi.object({
            code: joi.string().uppercase().min(2).required().messages({
                "string.base": "The code must be a string",
                "string.empty": "The code cannot be empty",
                "any.required": "The code is required",
                "string.min": "The code must be at least 2 characters long",
            }),
        }),
        query: joi.object({
            from: joi.string().uppercase().min(2).messages({
                "string.base": "The from must be a string",
                "string.empty": "The from cannot be empty",
                "string.min": "The from must be at least 2 characters long",
            }),
            to: joi.string().uppercase().min(2).messages({
                "string.base": "The to must be a string",
                "string.empty": "The to cannot be empty",
                "string.min": "The to must be at least 2 characters long",
            }),
            amount: joi.number().positive().required().messages({
                "number.base": "The amount must be a number",
                "number.empty": "The amount cannot be empty",
                "number.positive": "The amount must be positive",
                "any.required": "The amount is required",
            }),
        }),
    })
    .unknown();

export const schema = {
    currency,
};
