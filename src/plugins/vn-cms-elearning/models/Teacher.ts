import { TableName } from "..";
import ModelClass from "../../../core/Model";


class Teacher extends ModelClass {
    constructor() {
        super(TableName.Teacher, {
            id: {
                type: Number,
                unique: true
            },
            // website: String,
            // avatar: {},
            // description: String,
            // position: String,
            // slug: {
            //     type: String,
            //     unique: true
            // },
            // title: String,
            // email: {
            //     type: String,
            //     unique: true
            // },
            // name: {
            //     type: String,
            //     required: true,
            //     // unique: true
            // },
            // avatar: String,rs
            // introduce: String
        })
    }
}

export default new Teacher;