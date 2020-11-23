import { getFiles, config } from "./helper.js";
import fs from 'fs';
import path from 'path';

let __dirname = path.resolve();
// let configFilename = path.join(__dirname, "../../../", "config.js");

// console.log(process.cwd(), path.resolve())

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

    await loadModelFolder('app/model')
    

    let App = await config('App');

    for(let i in App.plugin){
        await loadModelFolder('app/plugin/' + App.plugin[i] + '/model')
    }

}




export async function loadPlugin(){
    let App = await config('App');
    let { plugin } = App;


    for (let i in plugin) {
        if(fs.existsSync(__dirname + '/app/plugin/' + plugin[i] + '/index.js')){
            await import('file:' + __dirname + '/app/plugin/' + plugin[i] + '/index.js');
        }
        
    }
}