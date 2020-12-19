import AbstractModel from './AbstractModel';
export default class MySQL implements AbstractModel {
    count(table: string): Promise<{
        error?: any;
        count?: number;
    }>;
    find(table: string, limit?: number, page?: number): Promise<{
        error?: any;
        data?: any;
    }>;
    findOne(): Promise<{
        error?: any;
        data?: any;
    }>;
    findMany(): Promise<{
        error?: any;
        data?: any;
    }>;
    insert(): Promise<{
        error?: any;
        insertCount?: number | undefined;
    }>;
    insertOne(): Promise<{
        error?: any;
        insertCount?: number | undefined;
    }>;
    insertMany(): Promise<{
        error?: any;
        inertCount?: number | undefined;
    }>;
    update(): Promise<{
        error?: any;
        updateCount?: number | undefined;
    }>;
    updateOne(): Promise<{
        error?: any;
        updateCount?: number | undefined;
    }>;
    updateMany(): Promise<{
        error?: any;
        updateCount?: number | undefined;
    }>;
    delete(): Promise<{
        error?: any;
        deleteCount?: number | undefined;
    }>;
    deleteOne(): Promise<{
        error?: any;
        deleteCount?: number | undefined;
    }>;
    deleteMany(): Promise<{
        error?: any;
        deleteCount?: number | undefined;
    }>;
}
export declare function getModel(name: string, fields?: {}, ...ref: any[]): void;
export declare function getAllModel(): {};
