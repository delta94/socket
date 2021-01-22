import { TableName } from "..";
import ModelClass from "../../../core/Model";


class Register extends ModelClass {
    constructor() {
        super(TableName.Register, {
            id: {
                type: Number,
                unique: true
            },
            // payment_method: {
            //     enum: ['chuyen-khoang', 'tien-mat'],
            //     default: 'chuyen-khoang'
            // }
            // coin_use: Number,
            // payment_method: {
            //     enum: ['Chuyển khoản', 'Tiền mặt'],
            //     default: 'Chuyển khoản'
            // },
            // trang_thai: {
            //     enum: ['duoc-duyet', 'chua-duoc-duyet'],
            //     default: 'duoc-duyet'
            // },
            // cfd_student: Number,
            // cfd_course: Number,
            // payment: [],
            // title: String
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
        })
    }
}

export default new Register;