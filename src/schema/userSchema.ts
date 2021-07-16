import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
const user = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String
    },
    password: {
        type: String,

    },
    googleId: {
        type: String
    },
    role: {
        type: String,
        required: true
    }
})
// create save function
user.pre("save", async function (next) {
    const newUser = this
    //this refers to user schema
    const plainPW = newUser.password
    //need to check if new user is modified or not
    if (newUser.isModified("password")) {
        //after checking it we need to hash the password using bcrypt
        newUser.password = await bcrypt.hash(plainPW, 10)

    }
    next()

})
user.methods.toJSON = function () {
    //this needs to create json format every time express does res.send
    const newUser = this
    {
        const userObject = newUser.toObject()
        delete userObject.password

        delete userObject.__v
        return userObject
    }
}
//we need to make the function that checks credentials
user.statics.checkCredentials = async function (email, plainPw, role) {
    //1 we need yo find user in db by his email
    const users = await this!.findOne({ email })
    //2 compare plain password with the hashed password
    if (users) {
        const hashedPw = users.password
        const isMatched = await bcrypt.compare(plainPw, hashedPw)
        //3 return
        if (isMatched) {
            return users

        } else {
            return null
        }
    } else {
        return null
    }

}
export default mongoose.model('user', user)