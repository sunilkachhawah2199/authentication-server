const pool = require("../utils/db");
const { QUERIES } = require("../constants/database");

export interface IUserLogin {
    email: string;
    password: string;
}

export enum Tool {
    "insurance" = "INSURANCE",
    "invoice" = "INVOICE"
}

export interface IUserRegister extends IUserLogin {
    uuid: string;
    name: string;
    organization: string;
    tool: Tool;
}

export interface User {
    email: string;
    name: string;
    organization: string;
    tool: Tool;
}


export const findByEMail = async (email: string): Promise<IUserRegister> => {
    try {
        const result = await pool.query(QUERIES.USER.FIND_BY_EMAIL, [email]);
        return result.rows[0];
    } catch (err) {
        console.log(err);
        throw new Error("Error finding user by email");
    }
}


export const insertUser = async (user: IUserRegister): Promise<User> => {
    try {
        const { email, name, password, tool, organization } = user;
        const result = await pool.query(QUERIES.USER.INSERT_USER, [email, name, password, tool, organization]);
        return result.rows[0];
    } catch (err) {
        console.log(err);
        throw new Error("Error inserting user");
    }
}