export declare const MODELTYPE: {
    NORMAL: string;
    RELATION: string;
    OBJECT: string;
    OBJECT_WITH_STRUCT: string;
    OBJECT_RELATION_KEY_ID: string;
    OBJECT_RELATION_MULTI_WITH_KEY_ONLEY: string;
    RELATION_WITH_ID: string;
    RELATION_WITH_STRUCT: string;
    LIST: string;
    LIST_TYPE: string;
    LIST_OBJECT: string;
    LIST_OBJECT_STRUCT: string;
    LIST_RELATION: string;
};
export declare function _prepareDataField(data: any, field: any, update?: boolean): Promise<any[]>;
export declare function prepareField(fields: any): {};
export declare function ModelTypeObject(data: any): any[];
export declare function ModelTypeList(data: any): any[];
export declare function ModelTypeRelation(this: {
    validate?: any;
    required?: any;
    multi?: any;
    relation?: any;
    resolve: Function;
}, data: any): Promise<unknown>;
export declare function renderPaginate({ page, limit, countDocument }: {
    page?: number | undefined;
    limit?: number | undefined;
    countDocument: any;
}): {
    nextPage?: number | undefined;
    previousPage?: number | undefined;
    currentPage: number;
    totalPage: number;
    count: number;
    perPage: number;
};
