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
exports.Toast = void 0;
var react_1 = __importStar(require("react"));
var react_native_1 = require("react-native");
var theme_1 = require("@/theme");
var width = react_native_1.Dimensions.get('window').width;
var Toast = function (_a) {
    var message = _a.message, _b = _a.type, type = _b === void 0 ? 'info' : _b, _c = _a.duration, duration = _c === void 0 ? 3000 : _c, visible = _a.visible, onHide = _a.onHide;
    var translateY = (0, react_1.useRef)(new react_native_1.Animated.Value(-100)).current;
    var opacity = (0, react_1.useRef)(new react_native_1.Animated.Value(0)).current;
    (0, react_1.useEffect)(function () {
        if (visible) {
            // Show animation
            react_native_1.Animated.parallel([
                react_native_1.Animated.timing(translateY, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                react_native_1.Animated.timing(opacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
            // Auto hide after duration
            var timer_1 = setTimeout(function () {
                hideToast();
            }, duration);
            return function () { return clearTimeout(timer_1); };
        }
    }, [visible]);
    var hideToast = function () {
        react_native_1.Animated.parallel([
            react_native_1.Animated.timing(translateY, {
                toValue: -100,
                duration: 300,
                useNativeDriver: true,
            }),
            react_native_1.Animated.timing(opacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start(function () {
            onHide();
        });
    };
    if (!visible) {
        return null;
    }
    var getBackgroundColor = function () {
        switch (type) {
            case 'success':
                return theme_1.colors.success;
            case 'error':
                return theme_1.colors.error;
            case 'warning':
                return theme_1.colors.warning;
            case 'info':
                return theme_1.colors.info;
            default:
                return theme_1.colors.gray800;
        }
    };
    var getIcon = function () {
        switch (type) {
            case 'success':
                return '✓';
            case 'error':
                return '✕';
            case 'warning':
                return '⚠';
            case 'info':
                return 'ℹ';
            default:
                return '';
        }
    };
    return (<react_native_1.Animated.View style={[
            styles.container,
            {
                transform: [{ translateY: translateY }],
                opacity: opacity,
            },
        ]}>
      <react_native_1.TouchableOpacity activeOpacity={0.9} onPress={hideToast} style={[
            styles.toast,
            { backgroundColor: getBackgroundColor() },
        ]}>
        <react_native_1.View style={styles.iconContainer}>
          <react_native_1.Text style={styles.icon}>{getIcon()}</react_native_1.Text>
        </react_native_1.View>
        <react_native_1.Text style={styles.message} numberOfLines={2}>
          {message}
        </react_native_1.Text>
      </react_native_1.TouchableOpacity>
    </react_native_1.Animated.View>);
};
exports.Toast = Toast;
var styles = react_native_1.StyleSheet.create({
    container: {
        position: 'absolute',
        top: 50,
        left: theme_1.spacing.md,
        right: theme_1.spacing.md,
        zIndex: 9999,
    },
    toast: __assign(__assign({ flexDirection: 'row', alignItems: 'center', paddingVertical: theme_1.spacing.md, paddingHorizontal: theme_1.spacing.md, borderRadius: theme_1.borderRadius.md }, theme_1.shadows.lg), { maxWidth: width - theme_1.spacing.md * 2 }),
    iconContainer: {
        marginRight: theme_1.spacing.sm,
    },
    icon: {
        fontSize: 20,
        color: theme_1.colors.white,
    },
    message: __assign(__assign({ flex: 1 }, theme_1.typography.body2), { color: theme_1.colors.white }),
});
