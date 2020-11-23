import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Model from './Model.js';
import Hook from './Hook.js';





dotenv.config();

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.EXPIRE_TOKEN });
}

export default (app) => {

    let Token = new class extends Model {
        graphql = false;
        constructor() {
            super('token', {
                accessToken: String,
                refreshToken: String
            });
            this.restAPI = false;
        }
    }


    app.post('/token', async (req, res) => {
        const refreshToken = req.body.token

        if (refreshToken == null) return res.sendStatus(403);

        let [data, error] = await Token.findOne({
            refreshToken
        })
        if (data == null) return res.sendStatus(403);

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) return res.sendStatus(403)
            const accessToken = generateAccessToken({ name: user.name })
            res.json({ accessToken })
        })
    })

    app.delete('/logout', async (req, res) => {
        let [data, error] = await Token.find({ refreshToken: req.body.refreshToken });

        res.sendStatus(204)
    })

    app.post('/login', async (req, res) => {
        const user = { name: req.body.username }

        const accessToken = generateAccessToken(user);

        const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
        let [data, error] = await Token.insertOrUpdate({
            accessToken, refreshToken
        })

        if (data !== null) {
            res.json({ accessToken, refreshToken })
        } else {
            return res.sendStatus(500)
        }

    })
}

