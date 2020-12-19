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
var Model_js_1 = __importDefault(require("../../vn-cms-core/Model.js"));
var Product = /** @class */ (function (_super) {
    __extends(Product, _super);
    function Product() {
        var _this = _super.call(this, 'ecommerce_product', {
            name: {
                type: String,
                required: true
            },
            image: [
                {
                    type: String
                }
            ],
            price: {
                type: String,
                required: true
            },
            store_id: {
                relation: 'ecommerce_store'
            },
            brand_id: {
                relation: 'ecommerce_brand'
            }
        }) || this;
        _this.restFulTagName = 'Ecommerce API';
        return _this;
    }
    return Product;
}(Model_js_1["default"]));
exports["default"] = new Product;
