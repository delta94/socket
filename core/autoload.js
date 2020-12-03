import { getFiles, config } from "./helper/helper.js";
import fs from 'fs';
import path from 'path';
import Hook from "./Hook.js";

// let __dirname = path.resolve();
// let configFilename = path.join(__dirname, "../../../", "config.js");

// console.log(process.cwd(), path.resolve())



global.__dirname = path.resolve();

async function loadModelFolder(folder){
    if(fs.existsSync(folder)){
        let models = getFiles(folder);
        for (let i in models) {
            await import('file:' + __dirname + '/' + models[i]);
        }
        return true;
    }

    return false;
}


export async function loadModel(){
    // let models = getFiles('app/Model');

    await loadModelFolder('app/models')
    

    let App = await config('App');

    for(let i in App.plugin){
        await loadModelFolder('plugin/' + App.plugin[i] + '/model')
    }

}




export async function loadPlugin(){
    let App = await config('App');
    let { plugin } = App;


    for (let i in plugin) {

        if(fs.existsSync(__dirname + '/plugin/' + plugin[i] + '/index.js')){
            await import('file:' + __dirname + '/plugin/' + plugin[i] + '/index.js');

        }
        
    }
}


async function loadRouterFolder(folder){
    if(fs.existsSync(folder)){
        let models = getFiles(folder);
        for (let i in models) {
            let fun = await import('file:' + __dirname + '/' + models[i]);
            if(typeof fun.default === 'function'){
                Hook.add_action('before-router', fun.default);
            }

        }
        return true;
    }

    return false;
}
global.demoFun = 'adsfasdf'
export async function loadRoute(){
    let App = await config('App');
    let { plugin } = App;


    for(let i in plugin){

        await loadRouterFolder('plugin/' + App.plugin[i] + '/router')
    }


}