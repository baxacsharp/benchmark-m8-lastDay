import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import createError from 'http-errors'
import userModel from '../schema/userSchema'
import { verifyToken } from './tools'

export const JWTAuthMidlleware = async (req: Request, res: Response, next: NextFunction) => {
    //1 we need to check if the authorization headers or not
    if (!req.headers.authorization) {
        throw new Error("authorization header must be provided")
    } else {
        try {
            //2 extract token from authorization header cause it has bearer before the actual token
            const token = req.headers.authorization.replace("Bearer", "")
            //3 verify token
            const content = await verifyToken(token)
            //find user in db and attach him the request object
            const user = await userModel.findById(content._id)
            if (user) {
                req.user = user
                next()
            } else {
                next(createError(404, "User not found!"))
            }
        } catch (error) {
            next(createError(401, "Token not valid"))
        }
    }
}

