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
exports.Button = void 0;
var react_1 = __importDefault(require("react"));
var react_native_1 = require("react-native");
var theme_1 = require("../theme");
var accessibility_1 = require("../utils/accessibility");
var Button = function (_a) {
    var title = _a.title, onPress = _a.onPress, _b = _a.variant, variant = _b === void 0 ? 'primary' : _b, _c = _a.disabled, disabled = _c === void 0 ? false : _c, _d = _a.loading, loading = _d === void 0 ? false : _d, style = _a.style, textStyle = _a.textStyle, accessibilityLabel = _a.accessibilityLabel, accessibilityHint = _a.accessibilityHint;
    var isPrimary = variant === 'primary';
    var isDisabled = disabled || loading;
    return (<react_native_1.TouchableOpacity style={[
            styles.button,
            isPrimary ? styles.primaryButton : styles.secondaryButton,
            isDisabled && styles.disabledButton,
            style,
        ]} onPress={onPress} disabled={isDisabled} activeOpacity={0.7} accessible={true} accessibilityRole={accessibility_1.A11Y_ROLES.BUTTON} accessibilityLabel={accessibilityLabel || title} accessibilityHint={accessibilityHint || (loading ? 'Loading' : (0, accessibility_1.getAccessibilityHint)(title.toLowerCase()))} accessibilityState={{
            disabled: isDisabled,
            busy: loading,
        }}>
      {loading ? (<react_native_1.ActivityIndicator color={isPrimary ? theme_1.colors.white : theme_1.colors.primary} size="small" accessibilityLabel="Loading"/>) : (<react_native_1.Text style={[
                styles.buttonText,
                isPrimary ? styles.primaryButtonText : styles.secondaryButtonText,
                isDisabled && styles.disabledButtonText,
                textStyle,
            ]} accessible={false}>
          {title}
        </react_native_1.Text>)}
    </react_native_1.TouchableOpacity>);
};
exports.Button = Button;
var styles = react_native_1.StyleSheet.create({
    button: {
        paddingVertical: theme_1.spacing.md,
        paddingHorizontal: theme_1.spacing.lg,
        borderRadius: theme_1.borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: accessibility_1.MIN_TOUCH_TARGET_SIZE, // WCAG 2.1 AA compliant touch target
    },
    primaryButton: {
        backgroundColor: theme_1.colors.primary,
    },
    secondaryButton: {
        backgroundColor: theme_1.colors.white,
        borderWidth: 1,
        borderColor: theme_1.colors.gray300,
    },
    disabledButton: {
        opacity: 0.5,
    },
    buttonText: __assign({}, theme_1.typography.button),
    primaryButtonText: {
        color: theme_1.colors.white,
    },
    secondaryButtonText: {
        color: theme_1.colors.primary,
    },
    disabledButtonText: {
        color: theme_1.colors.textDisabled,
    },
});
