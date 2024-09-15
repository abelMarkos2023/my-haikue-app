'use server'
import {redirect} from 'next/navigation'
import { getCollection } from "../lib/db";
import bcrypt from 'bcryptjs';
import {cookies} from 'next/headers'
import jwt from 'jsonwebtoken'

function validateEmail(email) {
const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
}
function isAlphaNumeric(input){
    const regex = /^[a-zA-Z0-9]*$/

    return regex.test(input);
}
export const login = async(prevState,formData) => {

    let failedObject = {
        success:false,
        message :"Invalid username or password"
    }

    let userData = {};

    userData.email = formData.get('email');
    userData.password = formData.get('password');

    if(!userData.email || !userData.password){
        return failedObject
    }
    const collection = await getCollection('users');
    const user = await collection.findOne({ email: userData.username });
    if (!user) {
        return failedObject
    }
    const valid = await bcrypt.compare(userData.password, user.password);
    if (!valid) {
        return failedObject
    }
    

    const token = jwt.sign({id:user._id,username:user.username,email:user.email},process.env.JWT_SECRET,{expiresIn:60*60*24});
    cookies().set('ourHaikueAppToken',token,
     {
         maxAge:60*60*24,
         secure:process.env.NODE_ENV !== 'development',
         sameSite:"strict"
     })
     return redirect('/')
}
export const logout = async() => {

    cookies().delete('ourHaikueAppToken');
    redirect('/')
}
export const register = async(initialState,formData) => {

    let userData = {}
    let errors = {}

    userData.username = formData.get('username');
    userData.password = formData.get('password');
    userData.email = formData.get('email');
    userData.confirmPassword = formData.get('confirmPassword');

   if(typeof userData.username !== 'string') userData.username = ''
   if(typeof userData.password !== 'string') userData.password = ''
   if(typeof userData.email !== 'string') userData.email = ''
   if(typeof userData.confirmPassword !== 'string') userData.confirmPassword = ''

   userData.username = userData.username.trim();
   userData.password = userData.password.trim();
   userData.email = userData.email.trim();
   userData.confirmPassword = userData.confirmPassword.trim();

   if(userData.username.length < 3 ) errors.username = "username must be Greater than three characters long"
   if(userData.username.length > 30 ) errors.username = "username mustn't exceed 30 characters "
   if(!isAlphaNumeric(userData.username)) errors.username = "You Can Only Use a comination of a-z, A-Z, 0-9 "
   if(userData.username == '') errors.username = "You Can't Provide an Empty Username"

   if(!validateEmail(userData.email)) errors.email = "Invalid Email Address"


   if(userData.password.length < 6) errors.password = "password mustn't be greater than 6 characters"
   if(userData.password.length > 60) errors.password = "password mustn't exceed 60 characters"
   if(userData.password == '') errors.password = "You Can't Provide an Empty Password"

   if(userData.confirmPassword != userData.password) errors.confirmPassword = "Passwords Don't Match"

   if(errors.username || errors.password || errors.confirmPassword )
    {
    return { errors,success:false}
   }

   const users = await getCollection('users');

   const salt = bcrypt.genSaltSync(10);

   userData.password = bcrypt.hashSync(userData.password,salt);


   const newUser = await users.insertOne({...userData});

   console.log(newUser)
   const userId = newUser.insertedId.toString()

   const token = jwt.sign({id:userId,username:userData.username,email:userData.email},process.env.JWT_SECRET,{expiresIn:60*60*24});
   cookies().set('ourHaikueAppToken',token,
    {
        maxAge:1000*60*60*24,
        secure:process.env.NODE_ENV !== 'development',
        sameSite:"strict"
    })


   return {
    sky:"blue",
    grass:"green",
    user:userData,
    errors:errors
   }

}