"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var Model_1 = __importDefault(require("../../../core/Model"));
var ElearingUser = /** @class */ (function (_super) {
    __extends(ElearingUser, _super);
    // fields = {
    //     name: {
    //         type: String,
    //         required: true
    //     },
    //     email: {
    //         type: String
    //     },
    //     password: {
    //         Type: TYPE.Hash
    //     },
    //     avatar: {
    //         Type: String
    //     }
    // }
    // name = 'user'
    function ElearingUser() {
        var _this = _super.call(this, 'elearning_student', {
            id: {
                unique: true
            },
            total_coin_current: Number,
            student_type: String,
            review: String,
            avatar: {},
            skype: String,
            email: String,
            phone: String,
            title: String,
            password: String
            // name: {
            //     type: String,
            //     required: true,
            //     // index: true
            //     // unique: true
            // },
            // email: {
            //     type: String,
            //     required: true,
            //     index: true,
            //     unique: true,
            //     // validate: {
            //     //     unique: 'Email has exists, please use another email'
            //     // }
            // },
            // gender: {
            //     enum: ['male', 'female'],
            //     required: true,
            // },
            // password: {
            //     Type: TYPE.Hash
            // },
            // avatar: {
            //     Type: String
            // }
        }) || this;
        _this.restFulTagName = 'Elearning API';
        return _this;
    }
    return ElearingUser;
}(Model_1["default"]));
// export default new ElearingUser;
