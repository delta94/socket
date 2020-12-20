import fs from 'fs'
import { getAllModel } from '../../../core/Model';
console.log('aaa')
export default function (app, server) {
    app.use('admin', function (req, res, next) {
        // console.log(fs.existsSync(__dirname + '/views/index.html'))
        if (fs.existsSync(__dirname + '/views' + req.path + '.html')) {
            console.log('pageview')
            return res.sendFile(__dirname + '/views' + req.path + '.html');
        }
        next();
        // res.sendFile(__dirname + '/views/index.html');

    })

    app.get('/get-uml-json', function (req, res) {
        let models = getAllModel()
        let responseJson = {};
        for (let i in models) {
            responseJson[i] = models[i]._fields;
        }
        // res.json(JSON.parse(JSON.stringify(models['token'])))
        res.json(responseJson)
    })

    // app.get('/aaaa', function(req,res){
    //     res.json({a: 1});
    // })

}