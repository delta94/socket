import ModelClass from "core/Model";
import { TableName } from "..";


class Supplier extends ModelClass{
    constructor(){
        super(TableName.Supplier, {
            name: {
                type: String,
                required: true,
                // unique: true
            },
        } )
    }
}

export default new Supplier;