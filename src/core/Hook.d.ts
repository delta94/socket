declare var _default: Hook;
export default _default;
declare function Hook(): void;
declare class Hook {
    add_action: (name: any, callback: any) => void;
    do_action: (name: any, parameters?: any[]) => Promise<{}>;
}
