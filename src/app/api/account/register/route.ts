import joi from 'joi';
import {apiHandler} from "@/app/_helpers/server/api";
import {usersRepo} from "@/app/_helpers/server";

module.exports = apiHandler({
    POST: register
});

async function register(req: Request) {
    const body = await req.json();
    await usersRepo.create(body);
}

register.schema = joi.object({
    email: joi.string().email().required(),
    username: joi.string().required(),
    password: joi.string().min(6).required(),
});