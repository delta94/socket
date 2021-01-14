import App from "app";
import Hook from "core/Hook";
// import { HookApp } from "core/Hook";
import { RequestHandler } from "express";
import { ROUTER } from "./type";

let group_url = '/';
let group_handle: any = []
export async function add_router_group(group: string, ...handle: RequestHandler[]) {
    group_url = '/' + group.replace(/\//g, '') + '/'
    group_handle = handle;
    let callback = group_handle.pop()
    if (typeof callback !== 'function') throw new Error('Last params is function is required')
    callback();
    group_url = '/';
    group_handle = []
}

export function add_router(name: string, ...handle: (RequestHandler | any)[]) {

    name = name.replace(/\//, '');

    let last = handle[handle.length - 1];


    if (typeof last === 'object') {
        handle.pop();
    }


    App.all(group_url + name, ...group_handle, ...handle)

    Hook.do_action(ROUTER.ADD, [name])
    // HookApp(app)
}