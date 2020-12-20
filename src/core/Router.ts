import Hook from "./Hook"





export default {
    get: (...expressParams) => {
        Hook.add_action('before-router', (app) => {
            app.get(...expressParams)
        })
    },
    post: (...expressParams) => {
        Hook.add_action('before-router', (app) => {
            app.post(...expressParams)
        })
    },
    put: (...expressParams) => {
        Hook.add_action('before-router', (app) => {
            app.put(...expressParams)
        })
    },
    delete: (...expressParams) => {
        Hook.add_action('before-router', (app) => {
            app.delete(...expressParams)
        })
    },
}