"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Card = void 0;
var react_1 = __importDefault(require("react"));
var react_native_1 = require("react-native");
var theme_1 = require("../theme");
var Card = function (_a) {
    var children = _a.children, _b = _a.shadow, shadow = _b === void 0 ? 'md' : _b, style = _a.style, accessibilityLabel = _a.accessibilityLabel, _c = _a.accessibilityRole, accessibilityRole = _c === void 0 ? 'none' : _c;
    return (<react_native_1.View style={[styles.card, theme_1.shadows[shadow], style]} accessible={!!accessibilityLabel} accessibilityLabel={accessibilityLabel} accessibilityRole={accessibilityRole}>
      {children}
    </react_native_1.View>);
};
exports.Card = Card;
var styles = react_native_1.StyleSheet.create({
    card: {
        backgroundColor: theme_1.colors.white,
        borderRadius: theme_1.borderRadius.lg,
        padding: theme_1.spacing.md,
    },
});
