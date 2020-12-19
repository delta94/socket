import mongodb from 'mongodb';
export default class MongoDB {
    defaultColumn: {
        _id: {
            type: typeof mongodb.ObjectID;
        };
        created_at: {
            type: DateConstructor;
            default: () => number;
        };
        updated_at: {
            type: DateConstructor;
            default: () => number;
        };
    };
    name: any;
    collection: any;
    _fields: any;
    constructor(name: string, fields?: {});
    find(data: {
        _id?: any;
    }, paginate?: any): Promise<any>;
    findOne(find: {
        _id?: any;
    }, ...ref: any): Promise<unknown>;
    findMany(): Promise<unknown>;
    insert(): void;
    insertMany(data: []): Promise<unknown>;
    insertOne(data: {
        _id?: any;
    }): Promise<unknown>;
    insertOrUpdate(data: any): Promise<unknown>;
    update(): void;
    findOneAndUpdate(find: {} | undefined, data: {}): Promise<unknown>;
    updateOne(find: {} | undefined, data: {}): Promise<unknown>;
    updateMany(): void;
    delete(find: {
        _id?: any;
    }): Promise<unknown>;
    deleteOne(): void;
    deleteMany(): void;
    createIndex(): Promise<void>;
    _generateFind(find?: {
        _id?: any;
    } | any): {};
}
export declare function getDatabase(name?: string): Promise<any>;
export declare function getModel(name: string, fields?: {}): any;
export declare function getCollection(name: string): Promise<any>;
export declare const TYPE: {
    Enum: (...ref: any) => (data: never) => null;
    Hash: (str: string) => string;
};
export declare function getAllModel(): {};
export declare function ObjectIDValid(str: string): boolean;
