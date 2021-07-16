import { profile } from "console";
import passport from "passport";
import express from 'express'
import GoogleStrategy from 'passport-google-oauth20'
import { Strategy } from "passport-oauth2";
import userSchema from "../schema/userSchema";
import { jwtAuthenticate } from "./tools";
//in order to use passport  we need 2 params 1 is event type in that case google, 2nd callback function
passport.use("passport", new GoogleStrategy({
    // PROVIDE CLIENTiD, clientToken, and callbackUrl  WARNING THE NAMES SHOULD BE THE SAME AS THE CODE IN THE BELOW IF YOU CHANGE THE VARIABLE NAME YOU WILL GET THE ERROR
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3001/user/googleRedirect"
}, async((accesToken, refreshToken, profile, passportNext) => {
    //this function will be executed when we got the response back from google
    try {
        console.log(profile)
        // when we receive the user from google, we check if the user existent ot not
        const user = await userSchema.findOne({ googleId: profile.id })
        //if the user is existent we need to create him couple of token
        if (user) {
            const tokens = await jwtAuthenticate(user)
            passportNext(null, { user, tokens })
        } else {
            // else we are creating a new user
            const newUser = {
                name: profile.name.givenName,
                surname: profile.name.familyName,
                email: profile.emails[0].value,
                role: "User",
                googleId: profile.id
            }
            const createdUser = await new userSchema(newUser)
            const savedUser = await createdUser.save()
            const tokens = await jwtAuthenticate(savedUser)
            passportNext(null, { user: savedUser, tokens })

        }
    } catch (error) {
        passportNext(error)
    }
})))
passport.serializeUser(function (user, passportNext) { // this is for req.user

    passportNext(null, user)
})


