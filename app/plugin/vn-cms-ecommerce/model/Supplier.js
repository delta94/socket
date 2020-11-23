import ModelClass from "../../vn-cms-core/Model.js";


class Supplier extends ModelClass{
    constructor(){
        super('ecommerce_supplier', {
            name: {
                type: String,
                required: true,
                // unique: true
            },
        } )

        this.restFulTagName = 'Ecommerce API'
    }
}

export default new Supplier;