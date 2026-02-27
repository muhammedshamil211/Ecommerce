import { body } from "express-validator";

export const registerValidator = [
    body("name")
        .notEmpty()
        .withMessage("Name is required")
        .isLength(4)
        .withMessage("Name must be atleast 4 charecter"),

    body("email")
        .isEmail()
        .withMessage("Valid email is required"),

    body("password")
        .isLength(6)
        .withMessage("Password must be atleast 6 charecter")
];

export const loginValidator = [
    body("email")
        .isEmail()
        .withMessage("Valid email is required"),

    body("password")
        .notEmpty()
        .withMessage("Password is required")

];