import mysql from 'mysql'
import ModelPattern from '../pattern/ModelPattern';

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
export default class MySQL implements ModelPattern {




    count(table: string): Promise<{ error?: any, count?: number }> {
        return new Promise((res, rej) => {
            con.query(`SELECT COUNT(*) as count FROM \`${table}\``, function (err, result) {
                if (err) return res({ error: err });
                console.log(result?.[0])
                return res(result?.[0])
            });

        })
    }
    find(table: string, limit: number = 20, page: number = 0): Promise<{ error?: any; data?: any; }> {
        return new Promise((resolve, reject) => {
            con.query(`SELECT * FROM \`${table}\` LIMIT ${limit} OFFSET ${page * limit}`, function (err, result, fields) {
                if (err) return resolve({ error: err });
                return resolve({ data: result })
            });
        })
    }
    findOne(): Promise<{ error?: any; data?: any; }> {
        throw new Error('Method not implemented.');
    }
    findMany(): Promise<{ error?: any; data?: any; }> {
        throw new Error('Method not implemented.');
    }
    insert(): Promise<{ error?: any; insertCount?: number | undefined; }> {
        throw new Error('Method not implemented.');
    }
    insertOne(): Promise<{ error?: any; insertCount?: number | undefined; }> {
        throw new Error('Method not implemented.');
    }
    insertMany(): Promise<{ error?: any; inertCount?: number | undefined; }> {
        throw new Error('Method not implemented.');
    }
    update(): Promise<{ error?: any; updateCount?: number | undefined; }> {
        throw new Error('Method not implemented.');
    }
    updateOne(): Promise<{ error?: any; updateCount?: number | undefined; }> {
        throw new Error('Method not implemented.');
    }
    updateMany(): Promise<{ error?: any; updateCount?: number | undefined; }> {
        throw new Error('Method not implemented.');
    }
    delete(): Promise<{ error?: any; deleteCount?: number | undefined; }> {
        throw new Error('Method not implemented.');
    }
    deleteOne(): Promise<{ error?: any; deleteCount?: number | undefined; }> {
        throw new Error('Method not implemented.');
    }
    deleteMany(): Promise<{ error?: any; deleteCount?: number | undefined; }> {
        throw new Error('Method not implemented.');
    }


}

export function getModel(name: string, fields = {}, ...ref) {

}


export function getAllModel(): {} {
    // return _.instance;

    return {}
}