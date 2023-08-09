const User = require('../model/user');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        console.log('email', email)

        if (name == undefined || name.length === 0 ||
            password == null || password.length === 0 ||
            email == null || email.length === 0) {
            return res.status(400).json({ err: "parameters are missing" })
        }
        const exisitinguser = await User.findOne({ where: { email } });
        if (exisitinguser) {
            console.log('user already existed');
            return res.status(409).json({ message: 'user alredy exist', alert: "user already existed" })
        }
        const saltrounds = 10;
        bcrypt.hash(password, saltrounds, async (err, hash) => {
            await User.create({ name, email, password: hash })
            return res.status(201).json({ message: 'successfully created new user' })

        })

    } catch (err) {
        return res.status(500).json(err)
    }
}
function generateAccesstoken(id,ispremiumuser) {
    return jwt.sign({ userId: id,ispremiumuser}, 'secretKey')
}
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("recevied login data:", email);
        console.log("bin", password);
        const user = await User.findOne({ where: { email } })
        if (user) {
            console.log(user.password);
            bcrypt.compare(password, user.password, (err, result) => {
                if (err) {
                    throw new ERROR("something went wrong");
                }
                if (result === true) {
                    //token: generateAccesstoken(user[0].id)
                    return res.status(200).json({ success: true, message: "user logged in succesfully", token: generateAccesstoken(user.id,user.ispremiumuser) })
                } else {
                    return res.status(400).json({ success: false, message: "password doesntttt match" })

                }
            })

        } else {
            return res.status(404).json({ success: false, message: "user doesnot exist" })
        }

    }
    catch (err) {
        return res.status(500).json(err)
    }

}
module.exports = {
    signup: signup,
    login: login,
    generateAccesstoken: generateAccesstoken
}