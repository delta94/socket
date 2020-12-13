import ModelClass, { TYPE } from "../../../core/Model.js";


class Register extends ModelClass{
    constructor(){
        super('elearning_register', {
            id: {
                type: Number,
                unique: true
            },
            coin_use: Number,
            payment_method: {
                enum: ['Chuyển khoản', 'Tiền mặt'],
                default: 'Chuyển khoản'
            },
            trang_thai: {
                enum: ['duoc-duyet', 'chua-duoc-duyet'],
                default: 'duoc-duyet'
            },
            cfd_student: Number,
            cfd_course: Number,
            payment: [],
            title: String
            // user: {
            //     relation: 'user',
            //     required: true
            //     // unique: true
            // },
            // course: {
            //     relation: 'elearning_course'
            // },
            // confirm: {
            //     enum: [true, false],
            //     default: false
            // }
        } )

        this.restFulTagName = 'Elearning API'
    }
}

export default new Register;