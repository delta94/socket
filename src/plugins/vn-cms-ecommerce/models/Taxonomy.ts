import ModelClass from "core/Model";
import { TableName } from "..";


class Taxonomy extends ModelClass{
    constructor(){
        super(TableName.Taxonomy, {
            name: {
                type: String,
                required: true,
                // unique: true
            },
        } )
    }
}

export default new Taxonomy;