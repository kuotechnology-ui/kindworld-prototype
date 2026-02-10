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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadingOverlay = void 0;
var react_1 = __importStar(require("react"));
var react_native_1 = require("react-native");
var theme_1 = require("@/theme");
var LoadingOverlay = function (_a) {
    var visible = _a.visible, message = _a.message;
    var opacity = (0, react_1.useRef)(new react_native_1.Animated.Value(0)).current;
    (0, react_1.useEffect)(function () {
        if (visible) {
            react_native_1.Animated.timing(opacity, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }).start();
        }
        else {
            react_native_1.Animated.timing(opacity, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start();
        }
    }, [visible]);
    return (<react_native_1.Modal transparent visible={visible} animationType="none">
      <react_native_1.Animated.View style={[styles.overlay, { opacity: opacity }]}>
        <react_native_1.View style={styles.container}>
          <react_native_1.ActivityIndicator size="large" color={theme_1.colors.primary}/>
          {message && <react_native_1.Text style={styles.message}>{message}</react_native_1.Text>}
        </react_native_1.View>
      </react_native_1.Animated.View>
    </react_native_1.Modal>);
};
exports.LoadingOverlay = LoadingOverlay;
var styles = react_native_1.StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        backgroundColor: theme_1.colors.white,
        borderRadius: 12,
        padding: theme_1.spacing.xl,
        alignItems: 'center',
        minWidth: 150,
    },
    message: __assign(__assign({}, theme_1.typography.body2), { color: theme_1.colors.textPrimary, marginTop: theme_1.spacing.md, textAlign: 'center' }),
});
