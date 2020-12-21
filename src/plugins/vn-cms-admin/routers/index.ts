import { HookApp } from 'core/Hook';
import fs from 'fs'
import path from 'path';


import { getAllModel } from '../../../core/Model';
import express from 'express';
const router = express.Router();

router.get('/*', function (req, res, next) {
    let dir = path.resolve(__dirname, '../views' + req.path + '.html')
    console.log(dir)

    if (fs.existsSync(dir)) {
        console.log('pageview')
        return res.sendFile(dir);
    }
    next();

})

router.get('/get-uml-json', function (req, res) {
    let models = getAllModel()
    let responseJson = {};
    for (let i in models) {
        responseJson[i] = models[i]._fields;
    }
    res.json(responseJson)
})


HookApp((app, server) => {
    app.use('/admin', router)
})