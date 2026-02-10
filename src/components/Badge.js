"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Badge = void 0;
var react_1 = __importDefault(require("react"));
var react_native_1 = require("react-native");
var theme_1 = require("../theme");
var Badge = function (_a) {
    var count = _a.count, text = _a.text, _b = _a.variant, variant = _b === void 0 ? 'primary' : _b, _c = _a.size, size = _c === void 0 ? 'medium' : _c, style = _a.style, textStyle = _a.textStyle, accessibilityLabel = _a.accessibilityLabel;
    var displayText = text || (count !== undefined ? String(count) : '');
    var isSmall = size === 'small';
    var getBackgroundColor = function () {
        switch (variant) {
            case 'success':
                return theme_1.colors.success;
            case 'warning':
                return theme_1.colors.warning;
            case 'error':
                return theme_1.colors.error;
            case 'info':
                return theme_1.colors.info;
            default:
                return theme_1.colors.primary;
        }
    };
    var defaultAccessibilityLabel = count !== undefined
        ? "".concat(count, " notification").concat(count !== 1 ? 's' : '')
        : displayText;
    return (<react_native_1.View style={[
            styles.badge,
            isSmall ? styles.badgeSmall : styles.badgeMedium,
            { backgroundColor: getBackgroundColor() },
            style,
        ]} accessible={true} accessibilityRole="text" accessibilityLabel={accessibilityLabel || defaultAccessibilityLabel}>
      <react_native_1.Text style={[
            styles.badgeText,
            isSmall ? styles.badgeTextSmall : styles.badgeTextMedium,
            textStyle,
        ]} accessible={false}>
        {displayText}
      </react_native_1.Text>
    </react_native_1.View>);
};
exports.Badge = Badge;
var styles = react_native_1.StyleSheet.create({
    badge: {
        borderRadius: theme_1.borderRadius.round,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 20,
    },
    badgeSmall: {
        paddingHorizontal: theme_1.spacing.xs,
        paddingVertical: 2,
        minHeight: 16,
    },
    badgeMedium: {
        paddingHorizontal: theme_1.spacing.sm,
        paddingVertical: theme_1.spacing.xs,
        minHeight: 24,
    },
    badgeText: {
        color: theme_1.colors.white,
        fontWeight: '600',
    },
    badgeTextSmall: {
        fontSize: 10,
        lineHeight: 12,
    },
    badgeTextMedium: __assign(__assign({}, theme_1.typography.caption), { color: theme_1.colors.white }),
});
