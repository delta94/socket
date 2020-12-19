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
var Room = /** @class */ (function (_super) {
    __extends(Room, _super);
    // fields = {
    //     name: String,
    //     people: [
    //         {
    //             relation: 'user',
    //             struct: ['name', '_id', 'avatar']
    //         }
    //     ],
    //     type: {
    //         type: TYPE.Enum('post', 'room', 'private')
    //     },
    //     creator: {
    //         relation: 'user',
    //         struct: ['name', 'avatar']
    //     }
    // }
    // name = 'room'
    function Room() {
        return _super.call(this, 'room', {
            name: String,
            people: {
                relation: 'user',
                multi: true
            },
            type: {
                "enum": ['post', 'room', 'private'],
                "default": 'private'
            },
            creator: {
                relation: 'user',
                required: true,
                validate: {
                    required: 'User is require'
                }
            }
        }) || this;
    }
    return Room;
}(Model_1["default"]));
exports["default"] = new Room;
