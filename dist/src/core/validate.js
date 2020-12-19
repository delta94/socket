"use strict";
exports.__esModule = true;
exports.validate = void 0;
var patternEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
var patternPhone = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
var patternUrl = /https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,}/gi;
var requiredMsg = 'This field is required';
var patternMsg = 'This field not match with pattern';
function validate(data, validate, message, exclude) {
    var _a, _b;
    if (message === void 0) { message = {}; }
    if (exclude === void 0) { exclude = false; }
    var errorObj = {};
    for (var i in validate) {
        if (i in data) {
            var rule = validate[i], value = data[i];
            value = value.trim();
            if (rule.required) {
                var msg = ((_a = message === null || message === void 0 ? void 0 : message[i]) === null || _a === void 0 ? void 0 : _a.required) || requiredMsg;
                if (!value) {
                    errorObj[i] = msg;
                    continue;
                }
            }
            if (rule.pattern) {
                var msg = ((_b = message === null || message === void 0 ? void 0 : message[i]) === null || _b === void 0 ? void 0 : _b.pattern) || patternMsg;
                var pattern = rule.pattern;
                if (pattern === 'email')
                    pattern = patternEmail;
                if (pattern === 'url')
                    pattern = patternUrl;
                if (!pattern.test(value)) {
                    errorObj[i] = msg;
                    continue;
                }
            }
        }
    }
    // exclude field of data not in validate
    if (exclude) {
        for (var i in data) {
            if (!(i in validate)) {
                delete data[i];
            }
        }
    }
    return data;
}
exports.validate = validate;
