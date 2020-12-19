import { getFiles } from "./helper/helper";
import fs from 'fs';
import path from 'path';
import Hook from "./Hook";
import appConfig from "../config/app";
// let __dirname = path.resolve();
// let configFilename = path.join(__dirname, "../../../", "config.js");

// console.log(process.cwd(), path.resolve())



// global.__dirname = path.resolve();

async function loadModelFolder(folder) {
    let dir = path.resolve(__dirname, folder);
    if (fs.existsSync(dir)) {
        let models = getFiles(dir);

        for (let i in models) {
            await import(models[i]);
        }
        return true;
    }

    return false;
}


export async function loadModel() {
    // let models = getFiles('app/Model');

    await loadModelFolder('../app/models')

    for (let i in appConfig.plugin) {
        await loadModelFolder('../plugins/' + appConfig.plugin[i] + '/models')
    }

}




export async function loadPlugin() {
    let { plugin } = appConfig;


    for (let i in plugin) {
        let dir = path.resolve(__dirname, '../plugins/' + plugin[i]);

        // console.log(dir, fs.existsSync(dir + '/index.js'))

        if (fs.existsSync(dir + '/index.js') || fs.existsSync(dir + '/index.ts')) {

            await import(dir);

        }

    }
}


async function loadRouterFolder(folder) {
    if (fs.existsSync(folder)) {
        let models = getFiles(folder);
        for (let i in models) {
            let fun = await import('file:' + __dirname + '/' + models[i]);
            if (typeof fun.default === 'function') {
                Hook.add_action('before-router', fun.default);
            }

        }
        return true;
    }

    return false;
}
// global.demoFun = 'adsfasdf'
export async function loadRoute() {
    let { plugin } = appConfig;


    for (let i in plugin) {

        await loadRouterFolder('plugin/' + plugin[i] + '/router')
    }


}