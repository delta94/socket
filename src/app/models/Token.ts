import User from "./User";
import Model from "core/Model";
import { NextFunction, Response } from "express";
import jwt, { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';

const tokenKey = process.env.ACCESS_TOKEN_SECRET || 'AccessToken'
const refreshKey = process.env.REFRESH_TOKEN_SECRET || 'AccessToken'
const expiresIn = process.env.EXPIRE_TOKEN || '3600000'

class Token extends Model {

    private key: string = '';
    private expiresIn: string = ''
    private refreshKey: string = ''

    constructor() {
        super('token', {
            accessToken: {
                type: String,
                index: true
            },
            refreshToken: {
                type: String,
                index: true
            },
            user: {
                relation: 'user',
                index: true
            },
            expired_in: Number,
            token_type: {
                enum: ['bearer'],
                default: 'bearer'
            },
            expired_at: Number,

        });


        this.key = tokenKey
        this.refreshKey = refreshKey
        this.expiresIn = expiresIn
    }


    public async create(data: { email, _id }): Promise<any> {
        let { _id, email } = data;

        let expired_at = new Date();
        expired_at.setMilliseconds(expired_at.getMilliseconds() + parseInt(this.expiresIn))



        let accessToken = this.generateAccessToken({ _id, email, rule: [], expired_at: expired_at.getTime(), expired_in: parseInt(this.expiresIn) })


        let refreshToken = jwt.sign({ email, _id }, this.refreshKey);

        let result = await this.insertOne({
            accessToken,
            refreshToken,
            user: _id,
            expired_at: expired_at.getTime(),
            expired_in: parseInt(this.expiresIn)
        })

        return result.data;
    }

    public createForever(data: { user }) {

    }

    public refreshToken(refreshToken: string) {

    }

    public delete(accessToken: string) {

    }



    private generateAccessToken(data: any) {

        return jwt.sign(data, this.key, { expiresIn: this.expiresIn });
    }


}


export function JWTMiddleware(req: any, res: any, next: NextFunction) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)

    jwt.verify(token, tokenKey, async (err: any, user: any) => {
        if (err) return cacheError(err, res)
        user = await User.findOne({ match: { _id: user._id } });

        if (user.data) {
            req.user = user.data;

            next()
        } else {
            return res.json({ error: 'User not exists' });
        }


    })
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

export default new Token;