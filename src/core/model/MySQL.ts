import mysql from 'mysql'
import ModelPattern, { deleteManyResponse, deleteOneResponse, findOneOptions, findOneResponse, findOptions, findResponse, insertManyResponse, intertOneResponse, intertOrUpdateResponse, ModelAbstract, updateManyResponse, updateOneResponse } from '../pattern/ModelPattern';

var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'blog_database'
})

con.connect((err) => {
    if (err) {
        console.log('mysql connect fail')
    } else {
        console.log('mysql connect success')
    }
})
export default class MySQL extends ModelAbstract implements ModelPattern {
    find(options: findOptions): Promise<findResponse> {
        throw new Error('Method not implemented.');
    }
    findOne(options: string | findOneOptions): Promise<findOneResponse> {
        throw new Error('Method not implemented.');
    }
    insertOne(options: {}): Promise<intertOneResponse> {
        throw new Error('Method not implemented.');
    }
    insertMany(options: []): Promise<insertManyResponse>{
        throw new Error('Method not implemented.');
    }
    insertOrUpdate(options: {} | []) : Promise<intertOrUpdateResponse>{
        throw new Error('Method not implemented.');
    }
    updateOne(query: {}, data: {}): Promise<updateOneResponse> {
        throw new Error('Method not implemented.');
    }
    updateMany(data: []): Promise<updateManyResponse>{
        throw new Error('Method not implemented.');
    }
    deleteOne(query: {}): Promise<deleteOneResponse> {
        throw new Error('Method not implemented.');
    }
    deleteMany(query: []): Promise<deleteManyResponse>{
        throw new Error('Method not implemented.');
    }
    count(options: { match?: {} | undefined; }): Promise<number> {
        throw new Error('Method not implemented.');
    }
    // insertMany, insertOrUpdate, updateMany, deleteMany

    // count(table: string): Promise<{ error?: any, count?: number }> {
    //     return new Promise((res, rej) => {
    //         con.query(`SELECT COUNT(*) as count FROM \`${table}\``, function (err, result) {
    //             if (err) return res({ error: err });
    //             console.log(result?.[0])
    //             return res(result?.[0])
    //         });

    //     })
    // }
    // find(table: string, limit: number = 20, page: number = 0): Promise<{ error?: any; data?: any; }> {
    //     return new Promise((resolve, reject) => {
    //         con.query(`SELECT * FROM \`${table}\` LIMIT ${limit} OFFSET ${page * limit}`, function (err, result, fields) {
    //             if (err) return resolve({ error: err });
    //             return resolve({ data: result })
    //         });
    //     })
    // }
    


}

export function getModel(name: string, fields = {}, ...ref) : ModelPattern {
    throw new Error('Method not implemented.');
}


export function getAllModel() : any {
    // return _.instance;

    return {}
}