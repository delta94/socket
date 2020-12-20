import fs from 'fs'
import path from 'path'
import { getAllModel } from 'core/Model';
import { HookApp } from 'core/Hook';
import express from 'express';
const Router = express.Router();

Router.get('/get-uml-json', function (req, res) {
    let models = getAllModel()
    let responseJson = {};
    for (let i in models) {
        responseJson[i] = models[i]._fields;
    }
    // res.json(JSON.parse(JSON.stringify(models['token'])))
    res.json(responseJson)
})

Router.get('/:path', (req, res, next) => {

    let dir = path.join(__dirname, `../views/${req.path}.html`);
    console.log(fs.existsSync(dir))
    if (fs.existsSync(dir)) {
        console.log('pageview')
        return res.sendFile(dir);
    }
    next();
    // res.sendFile(__dirname + '/views/index.html');
})

HookApp((app) => {
    app.use('/admin', Router)
})

