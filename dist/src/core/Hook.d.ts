declare class Hook {
    action_list: {};
    add_action(name: string, callback: Function): void;
    do_action(name: any, parameters?: any): Promise<{
        cache?: {};
    }>;
}
declare let hook: Hook;
export default hook;
export declare function add_router(name: string, callback: Function): void;
