import ModelClass from "core/Model";


class Category extends ModelClass{
    constructor(){
        super('ecommerce_category', {
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

export default new Category;