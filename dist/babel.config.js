"use strict";
module.exports = function (api) {
    api.cache(true);
    var presets = [
        "@babel/preset-env"
    ];
    return {
        presets: presets
    };
};
