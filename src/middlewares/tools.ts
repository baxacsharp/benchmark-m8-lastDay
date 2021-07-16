import jwt from 'jsonwebtoken'
import { string } from 'yargs'
import userModel from '../schema/userSchema'
interface user {

    _id: string


}

export const jwtAuthenticate = async (user: userModel) => {
    //Generates 2 tokens one is acces and second is refresh tokens with the user id
    const acccesToken = await generateJWT({ _id: user._id })
    const refreshToken = await generateRefreshToken({ _id: user._id })
    //user need to have refresh token in the schema to push to that 
    user.refreshToken = refreshToken
    //after pushing refreshToken to user refresh token we can save it
    await user.save()
    //also we need to return tokens
    return { acccesToken, refreshToken }
}
const generateJWT = (payload: string) =>
    // when we are generating access tokens we can get the payload as parameter and we will  create new promise for doing functions asynchronously
    new Promise((res, rej) =>
        //jwt,sign will take 3 params, payload, token and options
        jwt.sign(payload, process.env.ACCESS_TOKEN!, { expiresIn: "15m" }, (err, token) => {
            if (err) rej(err)
            res(token)
        }))
//after generating accesToken we need to verify it 
export const verifyToken = (token: string) =>
    //verifying tokens take token as paramater 
    new Promise((res, rej) =>
        jwt.sign(token, process.env.ACCES_TOKEN!, (err, decodedToken) => {
            if (err) rej(err)
            res(decodedToken)
        })
    )
const generateRefreshToken = (payload: string) =>
    new Promise((res, rej) =>
        jwt.sign(payload, process.env.REFRESH_TOKEN!, { expiresIn: "1w" }, (err, decoded) => {
            if (err) rej(err)
            res(decoded)
        })
    )
export const verifyRefreshToken = (token: string) =>
    new Promise((res, rej) =>
        jwt.sign(token, process.env.REFRESH_TOKEN!, (err, decodedToken) => {
            if (err) rej(err)
            res(decodedToken)
        })
    )
//after generating and verifying both tokens we need to create refreshToken middleware cause after 15 mins accesToken will expire we need to create another token by refreshToken
export const refreshToken = async (actualRefreshToken: string) =>
//Refresh Token will take Token as params
//1 we need to verify if the refreshToken is valid or not expired
{
    const content = await verifyRefreshToken(actualRefreshToken)

    //2 if the token is valid we are going to find user in db by his id
    const user = await userModel.findById(content._id)
    if (!user) throw new Error("User not found")
    //3 once we have the user we can compare the given refresh token with the refreshToken in the db
    if (user.refreshToken === actualRefreshToken) {
        //4 if everything went well we can generate refresh and access tokens
        const newAccessToken = await generateJWT({ _id: user._id })
        const newRefreshToken = await generateRefreshToken({ _id: user._id })
        user.refreshToken = newRefreshToken
        await user.save()
        return { newAccessToken, newRefreshToken }
    } else {
        throw new Error("tokens are not valid")
    }
}