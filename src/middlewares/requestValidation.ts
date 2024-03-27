import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";

const requestValidation =
    (schema: ObjectSchema) =>
    async (req: Request, res: Response, next: NextFunction) => {
        const body = Object.keys(req.body).length;
        const params = Object.keys(req.params).length;
        const query = Object.keys(req.query).length;
        if (req.method !== "GET" && !body && !params && !query) {
            return res
                .status(400)
                .json({ message: "Please fill out all the fields" });
        }

        try {
            if (body) {
                await schema.validateAsync({ body: req.body });
            }
            if (params) {
                await schema.validateAsync({ params: req.params });
            }
            if (query) {
                await schema.validateAsync({ query: req.query });
            }

            return next();
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    };

export default requestValidation;
