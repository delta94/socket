import Model from "core/Model";

class Token extends Model {

    constructor() {
        super('token', {
            accessToken: {
                type: String
            },
            refreshToken: {
                type: String
            },
            user: {
                relation: 'user'
            }
        });
    }
}

export default new Token;