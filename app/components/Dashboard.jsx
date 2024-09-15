import { ObjectId } from "mongodb"
import { getCollection } from "../../lib/db"

import Haikue from "./Haikue"

export default async function Dashboard({userId}){

    const getHaikues = async (id) => {
        const haikues = await getCollection('hakues')
        const userId = ObjectId.createFromHexString(id)
        const result = await haikues.find({userId}).sort({_id:-1})
        return result.toArray();
    }

    const haikues = await getHaikues(userId);
    return (
        <div>
            {
            haikues.map(haikue => <Haikue key={haikue._id.toString()} haikue={{photo:haikue.photo.toString(),line1:haikue.line1.toString(),line2:haikue.line2.toString(),line3:haikue.line3.toString(),_id:haikue._id.toString()}} />)
        }
        </div>
    )
}