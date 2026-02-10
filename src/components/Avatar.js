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
exports.Avatar = void 0;
var react_1 = __importDefault(require("react"));
var react_native_1 = require("react-native");
var theme_1 = require("../theme");
var OptimizedImage_1 = require("./OptimizedImage");
var accessibility_1 = require("../utils/accessibility");
var SIZES = {
    small: 32,
    medium: 48,
    large: 80,
};
var FONT_SIZES = {
    small: 14,
    medium: 18,
    large: 28,
};
var Avatar = function (_a) {
    var imageUrl = _a.imageUrl, name = _a.name, _b = _a.size, size = _b === void 0 ? 'medium' : _b, style = _a.style;
    var avatarSize = SIZES[size];
    var fontSize = FONT_SIZES[size];
    var getInitials = function (fullName) {
        if (!fullName)
            return '?';
        var names = fullName.trim().split(' ');
        if (names.length === 1)
            return names[0].charAt(0).toUpperCase();
        return (names[0].charAt(0).toUpperCase() + names[names.length - 1].charAt(0).toUpperCase());
    };
    var accessibilityLabel = name ? "".concat(name, "'s profile picture") : 'Profile picture';
    return (<react_native_1.View style={[
            styles.container,
            { width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 },
            style,
        ]} accessible={true} accessibilityRole={accessibility_1.A11Y_ROLES.IMAGE} accessibilityLabel={accessibilityLabel}>
      {imageUrl ? (<OptimizedImage_1.OptimizedImage source={{ uri: imageUrl }} style={[
                styles.image,
                { width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 },
            ]} cachePolicy="memory-disk" showLoadingIndicator={false} accessible={false}/>) : (<react_native_1.Text style={[styles.initials, { fontSize: fontSize }]} accessible={false}>
          {getInitials(name)}
        </react_native_1.Text>)}
    </react_native_1.View>);
};
exports.Avatar = Avatar;
var styles = react_native_1.StyleSheet.create({
    container: {
        backgroundColor: theme_1.colors.gray300,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    image: {
        resizeMode: 'cover',
    },
    initials: __assign(__assign({}, theme_1.typography.button), { color: theme_1.colors.textPrimary, fontWeight: '600' }),
});
