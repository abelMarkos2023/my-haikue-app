import { ObjectId } from "mongodb";
import { getCollection } from "../../../lib/db";
import CreateHaikueForm from "../../components/CreateHaikueForm";
import { getCookies } from "../../../lib/cookieHelper";
import { redirect } from "next/navigation";


export default async function Edit({params}){
    const haikues = await getCollection('hakues');

    const {id:userId} = getCookies()

    const {id} = params;

        const haikue = await haikues.findOne({_id:ObjectId.createFromHexString(id)});

        if(haikue.userId != userId){
            return redirect('/')
        }

        console.log(id)

    return (
        <>
            <CreateHaikueForm action={'edit'} haikue={haikue}/>
        </>
    )

}