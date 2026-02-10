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
exports.EmptyState = void 0;
var react_1 = __importDefault(require("react"));
var react_native_1 = require("react-native");
var theme_1 = require("@/theme");
var Button_1 = require("./Button");
var EmptyState = function (_a) {
    var title = _a.title, description = _a.description, _b = _a.icon, icon = _b === void 0 ? '📭' : _b, actionLabel = _a.actionLabel, onAction = _a.onAction;
    return (<react_native_1.View style={styles.container}>
      <react_native_1.Text style={styles.icon}>{icon}</react_native_1.Text>
      <react_native_1.Text style={styles.title}>{title}</react_native_1.Text>
      {description && <react_native_1.Text style={styles.description}>{description}</react_native_1.Text>}
      {actionLabel && onAction && (<Button_1.Button title={actionLabel} onPress={onAction} variant="primary" style={styles.button}/>)}
    </react_native_1.View>);
};
exports.EmptyState = EmptyState;
var styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: theme_1.spacing.xl,
        paddingVertical: theme_1.spacing.xxl,
    },
    icon: {
        fontSize: 64,
        marginBottom: theme_1.spacing.lg,
    },
    title: __assign(__assign({}, theme_1.typography.h3), { color: theme_1.colors.textPrimary, textAlign: 'center', marginBottom: theme_1.spacing.sm }),
    description: __assign(__assign({}, theme_1.typography.body1), { color: theme_1.colors.textSecondary, textAlign: 'center', marginBottom: theme_1.spacing.lg }),
    button: {
        marginTop: theme_1.spacing.md,
        minWidth: 200,
    },
});
