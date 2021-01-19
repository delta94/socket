import { TableName } from "..";
import ModelClass from "../../../core/Model";


class Payment extends ModelClass {
    constructor() {
        super(TableName.Payment, {
            id: {
                type: Number,

                unique: true,
            },
            // name: {
            //     type: String,
            //     required: true,
            //     // unique: true
            // },
            // user: {
            //     relation: 'user',
            //     required: true
            // },
            // course: {
            //     relation: 'elearning_course',
            //     required: true
            // },
            // money: Number,

        })
    }
}

export default new Payment;