import { getCookies } from "../lib/cookieHelper";
import Dashboard from "./components/Dashboard";


import RegisterForm from "./components/RegisterForm";


export default async function HomePage(){
    const auth = getCookies();

    return (
        <>
        
           {!auth ? (<>
            <p className="text-center text-2xl mb-4">
            Dont't Have an Account <strong>Create one</strong>
            </p>
            <RegisterForm />
           </>) : (
            <Dashboard userId = {auth.id}/>
           )}

        </>
    )
}