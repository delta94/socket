export default interface AbstractModel {
    find(table: string, limit: number, page: number): Promise<{
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
        insertCount?: number;
    }>;
    insertOne(): Promise<{
        error?: any;
        insertCount?: number;
    }>;
    insertMany(): Promise<{
        error?: any;
        inertCount?: number;
    }>;
    update(): Promise<{
        error?: any;
        updateCount?: number;
    }>;
    updateOne(): Promise<{
        error?: any;
        updateCount?: number;
    }>;
    updateMany(): Promise<{
        error?: any;
        updateCount?: number;
    }>;
    delete(): Promise<{
        error?: any;
        deleteCount?: number;
    }>;
    deleteOne(): Promise<{
        error?: any;
        deleteCount?: number;
    }>;
    deleteMany(): Promise<{
        error?: any;
        deleteCount?: number;
    }>;
    count(table: string): Promise<{
        error?: any;
        count?: number;
    }>;
}
