import express from 'express';
// import socket from './app/plugin/vn-cms-socket/';
import http from 'http';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors'

import Authentication, { authenticateToken } from 'core/Authentication';
import Hook from 'core/Hook';
import autoload from 'core/autoload';

// var log = console.log;
// console.log = function(...refs) {
//     log.apply(console, refs);
//     // Print the stack trace
//     console.trace();
// };

// const __dirname = path.resolve();

async function loadModule() {


    // files.forEach(e => {
    //     import('./' + e)
    // })

    dotenv.config();
    var app = express(),
        server = http.createServer(app);





    await autoload();

    // socket(server);


    app.use(express.json())

    app.use((err: { status?: any }, req, res, next) => {

        // This check makes sure this is a JSON parsing issue, but it might be
        // coming from any middleware, not just body-parser:
        console.log(err)
        if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
            return res.status(400).json({ error: err }); // Bad request
        }

        next();
    });


    app.use(cors())


    app.use(express.static(__dirname + '/public'));

    Authentication(app);

    app.get('/posts', authenticateToken, (req: any, res) => {
        res.json({ post: req.user.name })
    })

    // function authenticateToken(req, res, next) {
    //     const authHeader = req.headers['authorization']
    //     const token = authHeader && authHeader.split(' ')[1]
    //     if (token == null) return res.sendStatus(401)

    //     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    //         if (err) return res.sendStatus(403)
    //         req.user = user
    //         next()
    //     })
    // }

    await Hook.do_action('before-router', [app, server]);

    // app.get('/*/', function (req, res) {
    //     res.sendFile(__dirname + '/views/index.html');
    // });

    server.listen(process.env.PORT || 8888);

    console.log('app listen on port: ' + process.env.PORT || 8888)
    console.log('DEBUG', process.env.DEBUG);
}

loadModule();

