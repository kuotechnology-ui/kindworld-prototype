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
exports.SuccessAnimation = void 0;
var react_1 = __importStar(require("react"));
var react_native_1 = require("react-native");
var theme_1 = require("@/theme");
var width = react_native_1.Dimensions.get('window').width;
var SuccessAnimation = function (_a) {
    var visible = _a.visible, _b = _a.message, message = _b === void 0 ? 'Success!' : _b, onComplete = _a.onComplete, _c = _a.duration, duration = _c === void 0 ? 2000 : _c;
    var scale = (0, react_1.useRef)(new react_native_1.Animated.Value(0)).current;
    var opacity = (0, react_1.useRef)(new react_native_1.Animated.Value(0)).current;
    var checkmarkScale = (0, react_1.useRef)(new react_native_1.Animated.Value(0)).current;
    (0, react_1.useEffect)(function () {
        if (visible) {
            // Container animation
            react_native_1.Animated.parallel([
                react_native_1.Animated.spring(scale, {
                    toValue: 1,
                    tension: 50,
                    friction: 7,
                    useNativeDriver: true,
                }),
                react_native_1.Animated.timing(opacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
            // Checkmark animation with delay
            react_native_1.Animated.sequence([
                react_native_1.Animated.delay(200),
                react_native_1.Animated.spring(checkmarkScale, {
                    toValue: 1,
                    tension: 50,
                    friction: 7,
                    useNativeDriver: true,
                }),
            ]).start();
            // Auto hide
            var timer_1 = setTimeout(function () {
                react_native_1.Animated.parallel([
                    react_native_1.Animated.timing(scale, {
                        toValue: 0,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                    react_native_1.Animated.timing(opacity, {
                        toValue: 0,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                ]).start(function () {
                    checkmarkScale.setValue(0);
                    if (onComplete) {
                        onComplete();
                    }
                });
            }, duration);
            return function () { return clearTimeout(timer_1); };
        }
    }, [visible]);
    if (!visible) {
        return null;
    }
    return (<react_native_1.Modal transparent visible={visible} animationType="none">
      <react_native_1.View style={styles.overlay}>
        <react_native_1.Animated.View style={[
            styles.container,
            {
                transform: [{ scale: scale }],
                opacity: opacity,
            },
        ]}>
          <react_native_1.View style={styles.circle}>
            <react_native_1.Animated.Text style={[
            styles.checkmark,
            {
                transform: [{ scale: checkmarkScale }],
            },
        ]}>
              ✓
            </react_native_1.Animated.Text>
          </react_native_1.View>
          <react_native_1.Text style={styles.message}>{message}</react_native_1.Text>
        </react_native_1.Animated.View>
      </react_native_1.View>
    </react_native_1.Modal>);
};
exports.SuccessAnimation = SuccessAnimation;
var styles = react_native_1.StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        backgroundColor: theme_1.colors.white,
        borderRadius: 16,
        padding: theme_1.spacing.xl,
        alignItems: 'center',
        minWidth: width * 0.6,
    },
    circle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: theme_1.colors.success,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme_1.spacing.md,
    },
    checkmark: {
        fontSize: 48,
        color: theme_1.colors.white,
        fontWeight: 'bold',
    },
    message: __assign(__assign({}, theme_1.typography.h3), { color: theme_1.colors.textPrimary, textAlign: 'center' }),
});
