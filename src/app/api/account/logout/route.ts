import { cookies } from 'next/headers';
import { apiHandler } from "@/app/_helpers/server/api/api-handler";


module.exports = apiHandler({
    POST: logout
});

function logout() {
    cookies().delete('authorization');
}