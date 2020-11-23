import fs  from 'fs';
// import path from 'path'; 

export default async function config(name = 'App' , slug = '') {
    let absolutePath = './../../../../config/' + name + '.js';
    let rootPath = 'config/' + name + '.js';
    try{

        if(fs.existsSync(rootPath)){
            let configObject = await import(absolutePath);

            if(slug){
                return configObject.default[slug]
            }

            return {...configObject.default};
        }
    }catch(e){
        console.log(e)
    }

    return {};
    
}