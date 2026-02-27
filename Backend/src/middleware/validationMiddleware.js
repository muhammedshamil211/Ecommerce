import { validationResult } from "express-validator";

export const validate = (req, res, next) => {
    const errors = validationResult(req);


    if (!errors.isEmpty()) {

        const firstError = errors.array()[0].msg;

        return res.status(400).json({
            errors: firstError,
        });
    }

    next();
};