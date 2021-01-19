import { TableName } from "..";
import ModelClass from "../../../core/Model";


class Project extends ModelClass {
    constructor() {
        super(TableName.Project, {
            id: {
                type: Number,

                unique: true,
            },
            // name: {
            //     type: String,
            //     required: true,
            //     // unique: true
            // },
            // url: String,
            // cover: {
            //     type: String,
            //     required: true
            // },
            // user: {
            //     relation: 'user',
            //     required: true
            // }
        })
    }
}

export default new Project;