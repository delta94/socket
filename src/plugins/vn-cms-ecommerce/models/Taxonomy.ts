import ModelClass from "core/Model";


class Taxonomy extends ModelClass{
    constructor(){
        super('ecommerce_taxonomy', {
            name: {
                type: String,
                required: true,
                // unique: true
            },
        } )
    }
}

export default new Taxonomy;