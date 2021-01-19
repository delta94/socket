
import { TableName } from "..";
import ModelClass from "core/Model";
class CoinHistory extends ModelClass {
    constructor() {
        super(TableName.CoinHistory, {
            id: {
                type: Number,

                unique: true
            }
        })
    }
}


export default new CoinHistory;