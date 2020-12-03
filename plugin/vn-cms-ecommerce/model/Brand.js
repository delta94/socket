import ModelClass from "../../vn-cms-core/Model.js";


class Brand extends ModelClass{
    constructor(){
        super('ecommerce_brand', {
            name: {
                type: String,
                required: true,
                // unique: true
            },
        } )

        this.restFulTagName = 'Ecommerce API'
    }
}

export default new Brand;