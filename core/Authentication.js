import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Model from './Model.js';
import { getModel } from './model/MongoDB.js';





dotenv.config();

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.EXPIRE_TOKEN });
}

export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
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

    app.get('/api/get-user-info', authenticateToken, async (req,res) => {
        let { user } = req;

        if( user ){
            let { data, error } = await User.findOne(user._id);

            if(data){
                return res.json(data);
            }
        }

        return res.json({error: 'Server internal have some error'})
    })


    app.post('/api/refresh-token', async (req, res) => {
        const {refreshToken} = req.body

        if (refreshToken == null) return res.sendStatus(403);

        let {data, error} = await Token.findOne({
            refreshToken
        })
        if (data == null) return res.sendStatus(403);

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) return res.sendStatus(403)
            const accessToken = generateAccessToken(user)
            
            Token.findOneAndUpdate({ refreshToken }, {
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
        let {email, password, accessToken: reqAccessToken} = req.body;

        let {data: user, error: userError} = await User.findOne({email});

        if(user){
            let { email, _id, avatar, name } = user;

            const accessToken = generateAccessToken({ email, _id });

            const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
    
    
            let [data, error] = await Token.insertOrUpdate({
                accessToken, refreshToken, user: user._id
            })
            if (data !== null) {
                return res.json({ accessToken, refreshToken, email, _id, avatar, name })
            } else {
                return res.sendStatus(500)
            }
        }else{
            return res.sendStatus(500)
        }

        

    })
}

