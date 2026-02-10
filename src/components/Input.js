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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Input = void 0;
var react_1 = __importStar(require("react"));
var react_native_1 = require("react-native");
var theme_1 = require("../theme");
var accessibility_1 = require("../utils/accessibility");
var Input = function (_a) {
    var label = _a.label, error = _a.error, helperText = _a.helperText, containerStyle = _a.containerStyle, style = _a.style, _b = _a.required, required = _b === void 0 ? false : _b, accessibilityLabel = _a.accessibilityLabel, textInputProps = __rest(_a, ["label", "error", "helperText", "containerStyle", "style", "required", "accessibilityLabel"]);
    var _c = (0, react_1.useState)(false), isFocused = _c[0], setIsFocused = _c[1];
    var hasError = !!error;
    var inputAccessibilityLabel = accessibilityLabel ||
        (label ? (0, accessibility_1.getInputAccessibilityLabel)(label, required, error) : undefined);
    return (<react_native_1.View style={[styles.container, containerStyle]}>
      {label && (<react_native_1.Text style={styles.label} accessible={true} accessibilityRole="text">
          {label}{required && ' *'}
        </react_native_1.Text>)}
      <react_native_1.TextInput style={[
            styles.input,
            isFocused && styles.inputFocused,
            hasError && styles.inputError,
            style,
        ]} placeholderTextColor={theme_1.colors.gray400} onFocus={function () { return setIsFocused(true); }} onBlur={function () { return setIsFocused(false); }} accessible={true} accessibilityLabel={inputAccessibilityLabel} accessibilityState={{
            disabled: textInputProps.editable === false,
        }} accessibilityHint={helperText} {...textInputProps}/>
      {error && (<react_native_1.Text style={styles.errorText} accessible={true} accessibilityRole="alert" accessibilityLiveRegion="polite">
          {error}
        </react_native_1.Text>)}
      {!error && helperText && (<react_native_1.Text style={styles.helperText} accessible={true} accessibilityRole="text">
          {helperText}
        </react_native_1.Text>)}
    </react_native_1.View>);
};
exports.Input = Input;
var styles = react_native_1.StyleSheet.create({
    container: {
        marginBottom: theme_1.spacing.md,
    },
    label: __assign(__assign({}, theme_1.typography.body2), { color: theme_1.colors.textPrimary, marginBottom: theme_1.spacing.sm, fontWeight: '600' }),
    input: __assign(__assign({}, theme_1.typography.body1), { backgroundColor: theme_1.colors.white, borderWidth: 1, borderColor: theme_1.colors.gray300, borderRadius: theme_1.borderRadius.md, paddingVertical: theme_1.spacing.md, paddingHorizontal: theme_1.spacing.md, color: theme_1.colors.textPrimary, minHeight: accessibility_1.MIN_TOUCH_TARGET_SIZE }),
    inputFocused: {
        borderColor: theme_1.colors.accent,
        borderWidth: 2,
    },
    inputError: {
        borderColor: theme_1.colors.error,
    },
    errorText: __assign(__assign({}, theme_1.typography.caption), { color: theme_1.colors.error, marginTop: theme_1.spacing.xs }),
    helperText: __assign(__assign({}, theme_1.typography.caption), { color: theme_1.colors.textSecondary, marginTop: theme_1.spacing.xs }),
});
