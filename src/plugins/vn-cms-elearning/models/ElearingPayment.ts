import ModelClass from "../../../core/Model";


class Payment extends ModelClass {
    constructor() {
        super('elearning_payment', {
            id: {
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