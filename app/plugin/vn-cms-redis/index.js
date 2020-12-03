import Hook from './../vn-cms-core/Hook.js';
import redis from 'redis';
import appConfig from './../../../config/App.js';
import dbConfig from './../../../config/Database.js';

const { _id } = dbConfig;

const client = redis.createClient(appConfig.redis_port);

console.log('REDISSSSSSSSSSSSSSS')
export async function cache(name){
    return new Promise((resolve, reject) => {
        client.get(name, (err, data) => {
            resolve({data, err})

        })
    })
}


// client.set('5fafadb8334ee92f442d7a3c',JSON.stringify({a:1}))
// cache('5fafadb8334ee92f442d7a3c')

Hook.add_action('findOne-before', async function(find = {}){


    if(find.id || find._id || find){
        let {data, err} = await cache(find._id || find.id || find)
        
        if(data){
            return {cache: JSON.parse(data)};
        }
    }

    return {};
})

Hook.add_action('findOne-after', function(data){
    if(typeof data === 'object'){
        client.set(data[_id].toString(), JSON.stringify(data))
    }
    
})

Hook.add_action('updateOne-after', function(data){
    if(typeof data === 'object'){
        client.set(data[_id].toString(), JSON.stringify(data))
    }
})