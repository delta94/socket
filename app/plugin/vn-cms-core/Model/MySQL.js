

let Model

// (async () =>{
//     const dbConfig = await config('Database');
    
//     if (config.default === 'MongodDB') {
//         Model = MongodDB
//     } else if (config.default === 'MySQL') {
//         Model = MySQL
//     }

//     Model.connect();


// })()


export default class  MySQL{

    constructor(){

    }

    connect(){

    }

    find(){
        console.log('aaaaaaaaaaaaaa')
    }

    findOne(){}

    findMany(){}


    insert(){}

    insertOne(){}

    insertMany(){}


    update(){}

    updateOne(){}

    updateMany(){}

    delete(){}

    deleteOne(){}

    deleteMany(){}
}

export function getModel(){

}


export function getAllModel() {
    // return _.instance;
}