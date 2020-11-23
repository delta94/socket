import ModelClass from "../../vn-cms-core/Model.js";


class Taxonomy extends ModelClass{
    constructor(){
        super('ecommerce_taxonomy', {
            name: {
                type: String,
                required: true,
                // unique: true
            },
        } )

        this.restFulTagName = 'Ecommerce API'
    }
}

export default new Taxonomy;