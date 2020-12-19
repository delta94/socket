declare class Hook {
    action_list: {};
    add_action(name: any, callback: any): void;
    do_action(name: any, parameters?: any): Promise<{
        cache?: {};
    }>;
}
declare const _default: Hook;
export default _default;
