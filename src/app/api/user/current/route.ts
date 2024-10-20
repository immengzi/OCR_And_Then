import { apiHandler } from "@/app/_helpers/server/api";
import { usersRepo } from "@/app/_helpers/server";

module.exports = apiHandler({
    GET: getCurrent
});

async function getCurrent() {
    return await usersRepo.getCurrent();
}