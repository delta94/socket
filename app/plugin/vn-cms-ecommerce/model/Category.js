import ModelClass from "../../vn-cms-core/Model.js";


class Category extends ModelClass{
    constructor(){
        super('ecommerce_category', {
            name: {
                type: String,
                required: true,
                // unique: true
            },
        } )

        this.restFulTagName = 'Ecommerce API'
    }
}

export default new Category;