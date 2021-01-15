import jwt, { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import dotenv from 'dotenv';
import Model, { getModel } from './Model';
// import { getModel } from './model/MongoDB';
import { NextFunction, Request, Response } from 'express';


// const { TokenExpiredError, JsonWebTokenError } = jwt;


dotenv.config();

function generateAccessToken(user: any) {
    let { email, _id } = user;
    return jwt.sign({ email, _id }, process.env.ACCESS_TOKEN_SECRET || 'AccessToken', { expiresIn: process.env.EXPIRE_TOKEN });
}

function cacheError(err: any, res: Response) {
    if (err instanceof TokenExpiredError) {
        return res.status(403).json({ error: 1, error_code: 'TOKEN_EXPIRED', message: 'Token was expired' });
    }

    if (err instanceof JsonWebTokenError) {
        return res.status(403).json({ error: 1, error_code: 'TOKEN_INVALID', message: 'Token Invalid' });
    }

    console.log(err)
    return res.sendStatus(403)

}

export function JWTMiddleware(req: any, res: any, next: NextFunction) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || 'AccessToken', (err: any, user: any) => {


        if (err) return cacheError(err, res)

        req.user = user

        next()
    })
}

export default (app: any) => {

    let Token = getModel('token')

    let User = getModel('user');

    // let Token: any = {};
    // let User: any = {};


    app.get('/api/generate-token', async (req: Request, res: Response) => {


        let accessToken = jwt.sign({ 'email': 'admin' }, (window as any).process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15y' });
        return res.json({ accessToken: accessToken })
    })

    app.get('/api/get-user-info', JWTMiddleware, async (req: any, res: Response) => {
        let { user } = req;

        if (user) {

            let { data, error } = await User.findOne(user._id);

            if (data) {
                return res.json(data);
            }
        }

        return res.json({ error: 'Server internal have some error' })
    })


    app.post('/api/refresh-token', async (req: Request, res: Response) => {
        const { refreshToken } = req.body

        if (refreshToken == null) {
            return res.status(403).json({
                error: 1,
                error_code: 'REFRESH_TOKEN_REQUIRED',
                message: 'refreshToken is required'
            });
        }


        let { data, error } = await User.findOne({
            match: {
                refreshToken
            }
        })


        if (data == null) {
            return res.status(403).json({
                error: 1,
                error_code: 'REFRESH_TOKEN_INVALID',
                message: 'refreshToken invalid'
            });
        }
        jwt.verify(refreshToken, (window as any).process.env.REFRESH_TOKEN_SECRET, (err: any, user: any) => {
            if (err) return cacheError(err, res)
            const accessToken = generateAccessToken(user)

            User.updateOne({ refreshToken }, {
                accessToken
            })

            return res.json({ accessToken })
        })
    })

    app.delete('/logout', async (req: Request, res: Response) => {
        let { data, error } = await Token.findOne({ match: { refreshToken: req.body.refreshToken } });

        res.sendStatus(204)
    })

    app.post('/api/login', async (req: Request, res: Response) => {
        let { email, password, accessToken: reqAccessToken } = req.body;

        // let {data: user, error: userError} = await User.findOne({email});
        // let { data: token, error: tokenError } = Token.findOne({email})

        let [{ data: user, error: userError }, { data: token, error: tokenError }] = await Promise.all([User.findOne({ match: { email } }), Token.findOne({ match: { email } })])



        if (user) {

            let { _id, avatar, name } = user;

            const accessToken = generateAccessToken(user);

            const refreshToken = jwt.sign({ email, _id }, (window as any).process.env.REFRESH_TOKEN_SECRET)

            let { data, error } = await User.updateOne({ _id }, { accessToken, refreshToken });
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

