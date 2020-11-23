import { ModelTypeRelation, ModelTypeList } from "../app/plugin/vn-cms-core/helper/model"
import { Model } from "../app/plugin/vn-cms-core/Model"


test('Model test', () => {

    let model = new Model('demo', {
        field1: String,

        fields2: {
            type: Number,
            required: true,
            validate: {
                required: 'uid is required',
            }
        },
        field3: {
            type: Date,
            default: Date.now,
            required: true
        },


        field5: {
        },

        field6: {
            struct: {
                name: String,
                type: Number
            }
        },
        field4: {
            relation: 'user',
            validate: {
                required: 'uid is required',
            }
        },
        field7: {
            relation: 'user',
            multi: true
        },

        field8: {
            multi: true,
            relation: 'user',
        },
        field11: {
            relation: 'user',
            multi: true
        },
        field9: [

        ],
        field10: [
            String
        ],

        field12: [
            {
                title: String,
                name: String
            }
        ]
    })

    expect(model._fields).toEqual({
        field1: {
            type: 'NORMAL',
            resolve: String
        },

        fields2: {
            type: 'NORMAL',
            required: true,
            validate: {
                required: 'uid is required',
            },
            resolve: Number
        },
        field3: {
            type: 'NORMAL',
            default: Date.now,
            required: true,
            resolve: Date
        },


        field5: {
            type: 'NORMAL'
        },

        field6: {
            type: 'OBJECT',
            struct: {
                name: String,
                type: Number
            },
            resolve: (arr) => arr
        },
        field4: {
            type: 'RELATION',
            relation: 'user',
            validate: {
                required: 'uid is required',
            },
            resolve: ModelTypeRelation

        },
        field7: {
            type: 'RELATION',
            relation: 'user',
            multi: true,
            resolve: ModelTypeRelation

        },

        field8: {
            type: 'RELATION',
            multi: true,
            relation: 'user',
            resolve: ModelTypeRelation

        },
        field11: {
            type: 'RELATION',
            relation: 'user',
            multi: true,
            resolve: ModelTypeRelation

        },
        field9: {
            type: 'LIST',
            resolve: ModelTypeList
        },
        field10: {
            type: 'LIST',
            function: String,
            resolve: ModelTypeList
        },

        field12: {
            type: 'LIST',
            struct: {
                title: String,
                name: String
            },
            resolve: ModelTypeList
        }
    })
})