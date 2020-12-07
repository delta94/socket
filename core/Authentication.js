import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Model from './Model.js';
import { getModel } from './model/MongoDB.js';

const { TokenExpiredError, JsonWebTokenError } = jwt;



dotenv.config();

function generateAccessToken(user) {
    let {email, _id} = user;
    return jwt.sign({email, _id}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.EXPIRE_TOKEN });
}

function cacheError(err, res) {
    if (err instanceof TokenExpiredError) {
        return res.status(403).json({ error: 1, error_code: 'TOKEN_EXPIRED', message: 'Token was expired' });
    }

    if (err instanceof JsonWebTokenError) {
        return res.status(403).json({ error: 1, error_code: 'TOKEN_INVALID', message: 'Token Invalid' });
    }

    console.log(err)
    return res.sendStatus(403)

}

export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {


        if (err) return cacheError(err, res)

        req.user = user

        next()
    })
}

export default (app) => {

    let Token = new class extends Model {

        constructor() {
            super('token', {
                accessToken: String,
                refreshToken: String,
                user: {
                    relation: 'user'
                }
            });
            this.graphql = false;
            this.restAPI = false;
        }
    }

    let User = getModel('user');

    app.get('/api/get-user-info', authenticateToken, async (req, res) => {
        let { user } = req;
        if (user) {
            let { data, error } = await User.findOne(user._id);

            if (data) {
                return res.json(data);
            }
        }

        return res.json({ error: 'Server internal have some error' })
    })


    app.post('/api/refresh-token', async (req, res) => {
        const { refreshToken } = req.body

        if (refreshToken == null) {
            return res.status(403).json({
                error: 1,
                error_code: 'REFRESH_TOKEN_REQUIRED',
                message: 'refreshToken is required'
            });
        }


        let { data, error } = await User.findOne({
            refreshToken
        })


        if (data == null) {
            return res.status(403).json({
                error: 1,
                error_code: 'REFRESH_TOKEN_INVALID',
                message: 'refreshToken invalid'
            });
        }
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) return cacheError(err, res)
            const accessToken = generateAccessToken(user)

            User.findOneAndUpdate({ refreshToken }, {
                accessToken
            })

            return res.json({ accessToken })
        })
    })

    app.delete('/logout', async (req, res) => {
        let [data, error] = await Token.find({ refreshToken: req.body.refreshToken });

        res.sendStatus(204)
    })

    app.post('/api/login', async (req, res) => {
        let { email, password, accessToken: reqAccessToken } = req.body;

        // let {data: user, error: userError} = await User.findOne({email});
        // let { data: token, error: tokenError } = Token.findOne({email})

        let [{ data: user, error: userError }, { data: token, error: tokenError }] = await Promise.all([User.findOne({ email }), Token.findOne({ email })])



        if (user) {

            let { email, _id, avatar, name } = user;

            const accessToken = generateAccessToken(user);

            const refreshToken = jwt.sign({ email, _id }, process.env.REFRESH_TOKEN_SECRET)

            let { data, error } = await User.findOneAndUpdate({ _id }, { accessToken, refreshToken });
            console.log(data, error);

            // let [data, error] = await Token.insertOrUpdate({
            //     accessToken, refreshToken, user: user._id, email: user.email
            // })
            if (data) {
                return res.json({ accessToken, refreshToken, email, _id, avatar, name })
            } else {
                return res.sendStatus(500)
            }
        } else {
            // return res.sendStatus(403)

            return res.json({
                error: 1, message: {
                    email: 'Email not exists'
                }
            })
        }



    })
}

