import Model from 'core/Model'

class Page extends Model {
    constructor() {
        super('page', {
            slug: {
                type: String,
                required: true,
                unique: true
            }
        })
    }
}


export default new Page
