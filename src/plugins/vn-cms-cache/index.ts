import AbstractCache from "core/pattern/CachePattern";
import fs from 'fs';
let dir = 'storage/cache/';
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}


function serialize(obj: any) {
    return JSON.stringify(
        obj,
        function (k, v) {
            if (this[k] instanceof Date) {
                return ['__date__', +this[k]]
            }
            return v
        }
    )
}

function deserialize(s: string) {
    return JSON.parse(
        s,
        (_, v) => (Array.isArray(v) && v[0] === '__date__') ? new Date(v[1]) : v
    )
}



export default class CacheFile implements AbstractCache {
    async rememeber(key: string, callback: () => any) {
        let value = await this.get(key);
        if (typeof value === 'undefined') {
            value = await callback();
            this.set(key, value)
        }
        return value;
    }
    forget(key?: string) {
        if (key) {
            fs.unlinkSync(`${dir}${key}.json`)
        } else {
            fs.rmdirSync(`${dir}`, { recursive: true })
            fs.mkdirSync(dir, { recursive: true });
        }
    }
    async get(key: string): Promise<any> {
        if (fs.existsSync(`${dir}${key}.json`)) {
            let buf = fs.readFileSync(`${dir}${key}.json`);
            let value = deserialize(buf.toString());
            return value;
        }
        return undefined;
    }
    set(key: string, value: any): void {
        value = serialize(value);
        fs.writeFileSync(`${dir}${key}.json`, value);
    }
}