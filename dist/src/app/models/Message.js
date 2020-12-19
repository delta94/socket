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
var Model_1 = __importDefault(require("../../core/Model"));
// const { ObjectID } = mongodb;
var Message = /** @class */ (function (_super) {
    __extends(Message, _super);
    // name = 'chat';
    // fields = {
    //     comment: String,
    //     uid: {
    //         relation: 'user'
    //     },
    //     to: {
    //         // type: ObjectID,
    //         relation: 'room',
    //         required: true
    //     }
    // }
    function Message() {
        return _super.call(this, 'message', {
            comment: String,
            from: {
                relation: 'user',
                required: true,
                validate: {
                    required: 'uid is required'
                }
            },
            to: {
                // type: ObjectID,
                relation: 'room',
                required: true,
                validate: {
                    required: 'to is required'
                }
            }
        }) || this;
    }
    return Message;
}(Model_1["default"]));
exports["default"] = new Message;
