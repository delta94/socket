import App from "app";
import { HookApp } from "core/Hook";
import { Application, Request, RequestHandler } from "express";

let group_url = '';
let group_handle: any = []
export async function add_router_group(group: string, ...handle: RequestHandler[]) {
    group_url = '/' + group.replace(/\//g, '')
    group_handle = handle;
    let callback = group_handle.pop()
    if (typeof callback !== 'function') throw new Error('Last params is function is required')
    callback();
    group_url = '';
    group_handle = []
}


export function add_router(name: string, ...handle: RequestHandler[]) {
    App.all(group_url + name, ...group_handle, ...handle)
    // HookApp(app)
}