import ModelClass from "core/Model";


class Store extends ModelClass{
    constructor(){
        super('ecommerce_store', {
            name: {
                type: String,
                required: true,
                index: true,
                unique: true
            },
            slug: {
                required: true,
                unique: true
            },
            avatar: {
                type: String,
            },
            user: {
                relation: 'user'
            }
        } )
    }
}

export default new Store;