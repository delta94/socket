import redis from 'redis';
import config from './config';
// import dbConfig from './../../../config/Database.js';
import { HookBeforeFindOneModel, HookParamsBeforeFindOneModel } from 'hooks/modelhook.js';
import AbstractCache from 'CachePattern';

// const { _id } = dbConfig;

const client = redis.createClient(config.port);

console.log('REDISSSSSSSSSSSSSSS')
export async function cache(name): Promise<{ data?: any, error?: any }> {
    return new Promise((resolve, reject) => {
        client.get(name, (error, data) => {
            resolve({ data, error })

        })
    })
}

// HookBeforeFindOneModel(async (params: HookParamsBeforeFindOneModel): Promise<{ cache?: any }> => {
//     let { match: find } = params
//     if (find.id || find._id || find) {
//         let { data, error } = await cache(find._id || find.id || find)

//         if (data) {
//             return { cache: JSON.parse(data) };
//         }
//     }

//     return {};
// })

// Hook.add_action('findOne-before', async function (find: any = {}) {


//     if (find.id || find._id || find) {
//         let { data, err } = await cache(find._id || find.id || find)

//         if (data) {
//             return { cache: JSON.parse(data) };
//         }
//     }

//     return {};
// })

// Hook.add_action('findOne-after', function (data) {
//     if (typeof data === 'object') {
//         client.set(data[_id].toString(), JSON.stringify(data))
//     }

// })

// Hook.add_action('updateOne-after', function (data) {
//     if (typeof data === 'object') {
//         client.set(data[_id].toString(), JSON.stringify(data))
//     }
// })


export default class Redis implements AbstractCache {
    async rememeber(key: string, callback: () => any) {
        throw new Error('Method not implemented.');
    }
    forget(key: string) {
        throw new Error('Method not implemented.');
    }
    async get(key: string): Promise<any> {
        let { data, error } = await cache(key)
        if (data) {
            return data;
        }
        return null;
    }
    set(key: string, value: string): void {

        client.set(key, value)
    }

}