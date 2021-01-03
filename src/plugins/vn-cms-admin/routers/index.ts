import { HookApp } from 'core/Hook';
import fs from 'fs'
import path from 'path';


import { getAllModel } from '../../../core/Model';
import express from 'express';
import { add_router, add_router_group } from 'hooks/routerhook';

add_router_group('admin', () => {
    add_router('/:page', function (req, res, next) {

        let { page } = req.params

        let dir = path.resolve(__dirname, '../views/' + page + '.html')

        if (fs.existsSync(dir)) {
            console.log('pageview')
            return res.sendFile(dir);
        }
        next();

    })


    add_router('get-uml-json', function (req, res) {
        let models = getAllModel()
        let responseJson = {};
        for (let i in models) {
            responseJson[i] = models[i]._fields;
        }
        res.json(responseJson)
    })
})


