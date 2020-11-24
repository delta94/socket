import ModelClass from "../../vn-cms-core/Model.js";


class Payment extends ModelClass{
    constructor(){
        super('elearnig_payment', {
            name: {
                type: String,
                required: true,
                // unique: true
            },
            user: {
                relation: 'user',
                required: true
            },
            course: {
                relation: 'elearning_course',
                required: true
            },
            money: Number,
            
        } )

        this.restFulTagName = 'Elearning API'
    }
}

export default new Payment;