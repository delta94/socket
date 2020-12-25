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
    }
}

export default new Supplier;