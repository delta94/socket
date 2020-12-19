export function _prepareDataField(data: any, field: any, update?: boolean): Promise<any[]>;
export function prepareField(fields: any): {};
export function ModelTypeObject(data: any): any[];
export function ModelTypeList(data: any): any[];
export function ModelTypeRelation(data: any): Promise<any>;
export function renderPaginate({ page, limit, countDocument }: {
    page?: number | undefined;
    limit?: number | undefined;
    countDocument: any;
}): {
    nextPage: number;
    previousPage: number;
    currentPage: number;
    totalPage: number;
    count: any;
    perPage: number;
};
export namespace MODELTYPE {
    const NORMAL: string;
    const RELATION: string;
    const OBJECT: string;
    const OBJECT_WITH_STRUCT: string;
    const OBJECT_RELATION_KEY_ID: string;
    const OBJECT_RELATION_MULTI_WITH_KEY_ONLEY: string;
    const RELATION_WITH_ID: string;
    const RELATION_WITH_STRUCT: string;
    const LIST: string;
    const LIST_TYPE: string;
    const LIST_OBJECT: string;
    const LIST_OBJECT_STRUCT: string;
    const LIST_RELATION: string;
}
