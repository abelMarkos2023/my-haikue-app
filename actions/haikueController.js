'use server'

import { ObjectId } from "mongodb";
import { getCookies } from "../lib/cookieHelper";
import { getCollection } from "../lib/db";
import { redirect } from "next/navigation";
import cloudinary from 'cloudinary'


const allowedFormat = (input) => {
const regex = /^[a-zA-Z0-9 ,.]*$/
return regex.test(input)
}

const sharedLogic = (formData,id) => {

    const public_id = formData.get('public_id');
    const version = formData.get('version');
    const signature = formData.get('signature');


    
    let data = {};
    let errors = {};
    
    console.log(id)
    const userId = ObjectId.createFromHexString(id)

    data.line1 = formData.get('line1')
    data.line2 = formData.get('line2')
    data.line3 = formData.get('line3')

    if(typeof data.line1 !== 'string') data.line1 = '' 
    if(typeof data.line2 !== 'string') data.line2 = '' 
    if(typeof data.line3 !== 'string') data.line3 = '' 

        //replacing line breaks and taps with empty string
    data.line1 = data.line1.replace(/(\n\r|\r\n|\n|\r)/g," ")
    data.line2 = data.line2.replace(/(\n\r|\r\n|\n|\r)/g," ")
    data.line3 = data.line3.replace(/(\n\r|\r\n|\n|\r)/g," ")

    //trimin any starting or ending white space

    data.line1 = data.line1.trim()
    data.line2 = data.line2.trim()
    data.line3 = data.line3.trim()

    if(data.line1.length < 3) errors.line1 = "Line one must be greater than 3 charechters"
    if(data.line1.length > 12) errors.line1 = "Line one must be less than 7 charechters"


    if(data.line2.length < 7) errors.line2 = "Line two must be greater than 7 charechters"
     if(data.line2.length > 25) errors.line2 = "Line two must be less than 25 charechters"


    if(data.line3.length < 15) errors.line1 = "Line three must be greater than 15 charechters"
     if(data.line3.length > 35) errors.line1 = "Line three must be less than 35 charechters"

     if(!allowedFormat(data.line1)) errors.line1 = "You've entered a secial character that is not allowed"
     if(!allowedFormat(data.line2)) errors.line2 = "You've entered a secial character that is not allowed"
     if(!allowedFormat(data.line3)) errors.line3 = "You've entered a secial character that is not allowed"


     if(data.line1.length == 0) errors.line1 = "Line #1 Is Required"
     if(data.line2.length == 0) errors.line2 = "Line #2 Is Required"
     if(data.line3.length == 0) errors.line3 = "Line #3 Is Required"

     const cloudinaryConfig = 
     cloudinary.config({
       cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
       api_key: process.env.CLOUDINARY_API_KEY,
       api_secret: process.env.CLOUDINARY_API_SECRET,
     });
      

     const expectedSignature = cloudinary.utils.api_sign_request({public_id,version},cloudinaryConfig.api_secret)

     if(expectedSignature === signature){
        data.photo = public_id;
     }


     return {
        errors,
        data,
        userId
     }
}

export const createHaikue = async (prevState,formData) => {
        const {id} =  getCookies();

    const {errors, data, userId } = sharedLogic(formData,id);
    
    if(errors.line1 || errors.line2 || errors.line3) {
        return {success:false, errors}; 
    }


    const haikueCollection = await getCollection('hakues');
    const result = await haikueCollection.insertOne({ userId,...data });

    console.log(result)
    redirect('/')

}

export const editHaikue = async (prevState,formData) => {

    const {id} =  getCookies();
    const {errors, data, userId } = sharedLogic(formData,id);
    
    if(errors.line1 || errors.line2 || errors.line3) {
        return {success:false, errors}; 
    }

    let haikueId = formData.get('haikueId')

    if(typeof haikueId !== 'string') haikueId = ''

    if(id != formData.get('userId')){
        redirect('/')
    }

    haikueId = ObjectId.createFromHexString(haikueId)


    const haikueCollection = await getCollection('hakues');
    const result = await haikueCollection.findOneAndUpdate({_id:haikueId},{$set:data})

    console.log(result)
    redirect('/')

}

export const deleteHaikue = async(formData) => {

    const id = formData.get('haikueId')
    const {id:user} = getCookies()

    const haikues = await getCollection('hakues');
    const haikue = await haikues.findOne({_id:ObjectId.createFromHexString(id)})

    if(haikue.userId.toString() !== user){
        redirect('/')
    }
    await haikues.findOneAndDelete({_id:ObjectId.createFromHexString(id)});
    redirect('/')


}