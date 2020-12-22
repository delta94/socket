import Hook from "core/Hook"

const HookType = {
    BEFORE_MODEL_CHANGE: 'BEFORE_MODEL_CHANGE',
    AFTER_MODEL_CHANGE: 'AFTER_MODEL_CHANGE',
    BEFORE_FIND_ONE_DATA: 'BEFORE_FIND_DATA'
}

export function DoBeforeModelChange(params: any[] = []) {
    return Hook.do_action(HookType.BEFORE_MODEL_CHANGE, params)
}


export function HookBeforeModelChange(callback: (...params: any[]) => any) {
    Hook.add_action(HookType.BEFORE_MODEL_CHANGE, callback)
}
// ------------------

export function DoAfterModelChange(params: any[] = []) {
    return Hook.do_action(HookType.AFTER_MODEL_CHANGE, params)
}

export function HookAfterModelChange(callback: (...params: any[]) => any) {
    Hook.add_action(HookType.AFTER_MODEL_CHANGE, callback)
}

// ------------------

export interface HookParamsBeforeFindOneModel { match?: any }

export async function DoBeforeFindOneModel(params : HookParamsBeforeFindOneModel): Promise<{ cache?: any }> {
    return await Hook.do_action(HookType.BEFORE_FIND_ONE_DATA, params)
}


export function HookBeforeFindOneModel(callback: (...params: any[]) => Promise<{ cache?: any }>) {
    return Hook.add_action(HookType.BEFORE_FIND_ONE_DATA, callback)
}