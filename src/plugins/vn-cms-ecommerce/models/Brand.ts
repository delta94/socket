import ModelClass from "core/Model";


class Brand extends ModelClass{
    constructor(){
        super('ecommerce_brand', {
            name: {
                type: String,
                required: true,
                // unique: true
            },
            slug: {
                required: true,
                unique: true
            }
        } )
    }
}

export default new Brand;