import fs from 'fs';

import path from 'path';


// let configs = getFiles('config');


Object.defineProperty(Object.prototype, "filterFun", {
    enumerable: false,
    value: function (callback) {
        if (this instanceof Array) {
            return this.filter(callback);
        }


        let res = {};
        for (let i in this) {
            if (callback(this[i], i)) {
                res[i] = this[i]
            }
        }
        return res;
    }
});


export function getFiles(dir, files_) {
    const folder = path.resolve(dir);


    files_ = files_ || [];
    var files = fs.readdirSync(dir);
    for (var i in files) {
        var name = folder + '/' + files[i];
        if (fs.statSync(name).isDirectory()) {
            getFiles(name, files_);
        } else {
            // files_.push(files[i]);
            files_.push(dir + '/' + files[i]);
        }
    }
    return files_;
}


let config_store = {};

async function config(name = 'app', slug = '') {

    if (name in config_store) {
        if (slug) {
            return config_store[name][slug]
        }
        return config_store[name];
    }


    let absolutePath = path.resolve('config/' + name + '.js');
    let rootPath = 'config/' + name + '.js';


    try {

        if (fs.existsSync(rootPath)) {
            let configObject = await import('file:' + absolutePath);

            config_store[name] = configObject.default;

            if (slug) {

                return configObject.default[slug]
            }

            return { ...configObject.default };
        }
    } catch (e) {
        console.log(e)
    }

    return {};

}

export function copyObjectExcept(object, arr = []) {
    let ob = {};
    for (let i in object) {
        if (!arr.includes(i)) {
            ob[i] = object[i]
        }
    }

    return ob;
}

export function copyObjectFields(object, fields = []) {
    let ob = {};
    for (let i in object) {
        if (fields.includes(i)) {
            ob[i] = object[i]
        }
    }

    return ob;
}

export function getMethods(obj) {
    let properties = new Set()
    let currentObj = obj
    do {
        Object.getOwnPropertyNames(currentObj).map(item => properties.add(item))
    } while ((currentObj = Object.getPrototypeOf(currentObj)))
    return [...properties.keys()].filter(item => typeof obj[item] === 'function')
}

export function objectIndex(obj, index = 0) {
    for (let i in obj) {
        if (index-- === 0) return [i, obj[i]];

    }
    return [];
}

export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


export function isEmptyObject(obj) {
    return Object.keys(obj).length === 0 && obj.constructor === Object
}