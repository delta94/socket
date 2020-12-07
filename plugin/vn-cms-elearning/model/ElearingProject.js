import ModelClass from "../../../core/Model.js";


class Project extends ModelClass{
    constructor(){
        super('elearning_project', {
            id: {
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
        } )

        this.restFulTagName = 'Elearning API'
    }
}

export default new Project;