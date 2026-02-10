"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.theme = exports.borderRadius = exports.shadows = exports.spacing = exports.typography = exports.colors = void 0;
var colors_1 = require("./colors");
Object.defineProperty(exports, "colors", { enumerable: true, get: function () { return colors_1.colors; } });
var typography_1 = require("./typography");
Object.defineProperty(exports, "typography", { enumerable: true, get: function () { return typography_1.typography; } });
var spacing_1 = require("./spacing");
Object.defineProperty(exports, "spacing", { enumerable: true, get: function () { return spacing_1.spacing; } });
var shadows_1 = require("./shadows");
Object.defineProperty(exports, "shadows", { enumerable: true, get: function () { return shadows_1.shadows; } });
var borderRadius_1 = require("./borderRadius");
Object.defineProperty(exports, "borderRadius", { enumerable: true, get: function () { return borderRadius_1.borderRadius; } });
exports.theme = {
    colors: colors_1.colors,
    typography: typography_1.typography,
    spacing: spacing_1.spacing,
    shadows: shadows_1.shadows,
    borderRadius: borderRadius_1.borderRadius,
};
