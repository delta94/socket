import { TableName } from "..";
import ModelClass from "../../../core/Model";


class Review extends ModelClass {
    constructor() {
        super(TableName.Review, {
            id: {
                type: Number,

                unique: true,
            },
            content: {
                type: String,
                required: true,
                // unique: true
            },
            user: {
                relation: 'user',
                required: true
            }
        })

    }
}

export default new Review;