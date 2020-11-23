import ModelClass from "../../vn-cms-core/Model.js";


class Store extends ModelClass{
    constructor(){
        super('ecommerce_store', {
            name: {
                type: String,
                required: true,
                index: true
                // unique: true
            },
            slug: {
                required: true,
            },
            avatar: {
                type: String,
            },
            user: {
                relation: 'user'
            }
        } )

        this.restFulTagName = 'Ecommerce API'
    }
}

export default new Store;