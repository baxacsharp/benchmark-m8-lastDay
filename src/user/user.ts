import express from 'express'
import createErrors from 'http-errors'
import userModel from '../schema/userSchema'
import passport from 'passport'
import accomodationSchema from '../schema/accomodationSchema'
import { JWTAuthMidlleware } from '../middlewares/middlewares'
import { jwtAuthenticate, refreshToken } from '../middlewares/tools'


const userRouter = express.Router()
userRouter.post('/register', async (req, res, next) => {
    try {
        const newUser = await new userModel(req.body)
        const { _id, role } = await newUser.save()
        res.status(201).send({ _id, role })
    } catch (error) {
        next(createErrors(400, "please provide required fields"))
    }
})
userRouter.get('login', async (req, res, next) => {
    try {
        const { email, password, role } = req.body
        //1 we need to get the required fields from login and check credentials from it
        const user = await userRouter.checkCredentials(email, password, role)
    } catch (error) {

    }
})
userRouter.get("/me", JWTAuthMidlleware, async (req, res, next) => {
    try {
        const user = await userModel.find()
        res.send(user)
    } catch (error) {
        next(createErrors(404, "user not found"))
    }
})
userRouter.get("/me", JWTAuthMidlleware, async (req, res, next) => {
    try {
        res.send(req.user)
    } catch (error) {
        next(createErrors(401, "You are not authtorized to get the other user's data"))
    }
})

userRouter.delete("/me", JWTAuthMidlleware, async (req, res, next) => {
    try {
        const deleteOne = await userModel.deleteOne(req.user)
        res.send("deletedSuccessfully")
    } catch (error) {
        next(createErrors(401, "You are not authtorized to get the other user's data"))
    }
})
userRouter.post("/me", JWTAuthMidlleware, async (req, res, next) => {
    try {
        const newAccomodations = await new accomodationSchema(req.body)
        res.send(newAccomodations)
    } catch (error) {
        next(createErrors(401, "You are not authtorized to get the other user's data"))

    }
})
userRouter.get("/me/accomodations", JWTAuthMidlleware, async (req, res, next) => {
    try {
        const accomodations = await accomodationSchema.find()
        res.send(accomodations)
    } catch (error) {
        next(createErrors(401, "You are not authtorized to get the other user's data"))

    }

})