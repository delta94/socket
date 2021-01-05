import { getFiles } from "./helper/helper";
import fs from 'fs';
import path from 'path';
import Hook from "./Hook";
import appConfig from "../config/app";

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


async function loadModel() {


    await loadModelFolder('../app/models')

    await forEachPlugin(async (pluginName, dir) => {
        await loadModelFolder(dir + '/models')
    })

}


async function loadPlugin() {

    await forEachPlugin(async (pluginName, dir) => {

        console.log(dir, fs.existsSync(dir + '/index.js'), fs.existsSync(dir + '/index.ts'))

        if (fs.existsSync(dir + '/index.js') || fs.existsSync(dir + '/index.ts')) {

            await import(dir);

        }
    })
}


function loadRouterFolder() {
    let dir = path.resolve(__dirname, '../routers/');
    fs.readdir(dir, (err, files) => {
        files.forEach(file => {
            import(dir + `/${file}`)
        })
    })

    forEachPlugin(async (pluginName, dir) => {
        dir += '/routers'
        if (fs.existsSync(dir)) {
            fs.readdir(dir, (err, files) => {
                files.forEach(file => {
                    import(dir + `/${file}`)
                })

            })
        }
    })


    // if (fs.existsSync(folder)) {
    //     let models = getFiles(folder);
    //     for (let i in models) {
    //         let fun = await import(__dirname + '/' + models[i]);
    //         if (typeof fun.default === 'function') {
    //             Hook.add_action('before-router', fun.default);
    //         }
    //     }
    //     return true;
    // }

    // return false;
}

async function forEachPlugin(callback: (pluginName: string, dir: string) => void) {
    let { plugin } = appConfig;

    for (let i in plugin) {
        let dir = path.resolve(__dirname, '../plugins/' + plugin[i]);

        await callback(plugin[i], dir);

    }
}

export default async function autoload() {
    await loadModel();
    await loadPlugin();

    loadRouterFolder();
}