import jwt from "jsonwebtoken";
import { cookies } from "next/headers"


export const getCookies = () => {

    const theCookie = cookies().get('ourHaikueAppToken')?.value

    if(theCookie){

        try {
            const decoded = jwt.verify(theCookie,process.env.JWT_SECRET);
            return decoded;
        } catch (error) {
            return null
        }
    }
}