"use strict";
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
exports.PointsDisplay = void 0;
var react_1 = __importStar(require("react"));
var react_native_1 = require("react-native");
var theme_1 = require("../theme");
/**
 * PointsDisplay Component
 * Displays points with optional growth indicator and animated transitions
 */
var PointsDisplay = function (_a) {
    var points = _a.points, _b = _a.size, size = _b === void 0 ? 'medium' : _b, _c = _a.showGrowth, showGrowth = _c === void 0 ? false : _c, _d = _a.growthPercentage, growthPercentage = _d === void 0 ? 0 : _d, _e = _a.label, label = _e === void 0 ? 'Points' : _e;
    var animatedValue = (0, react_1.useRef)(new react_native_1.Animated.Value(0)).current;
    var previousPoints = (0, react_1.useRef)(points);
    (0, react_1.useEffect)(function () {
        // Animate number transition when points change
        if (previousPoints.current !== points) {
            animatedValue.setValue(previousPoints.current);
            react_native_1.Animated.timing(animatedValue, {
                toValue: points,
                duration: 800,
                useNativeDriver: false,
            }).start();
            previousPoints.current = points;
        }
    }, [points, animatedValue]);
    var animatedPoints = animatedValue.interpolate({
        inputRange: [0, points || 1],
        outputRange: [0, points || 1],
    });
    var styles = getStyles(size);
    var isPositiveGrowth = growthPercentage > 0;
    var isNegativeGrowth = growthPercentage < 0;
    return (<react_native_1.View style={styles.container}>
      <react_native_1.Animated.Text style={styles.pointsText}>
        {animatedPoints.__getValue().toFixed(0)}
      </react_native_1.Animated.Text>
      <react_native_1.Text style={styles.labelText}>{label}</react_native_1.Text>
      {showGrowth && growthPercentage !== 0 && (<react_native_1.View style={styles.growthContainer}>
          <react_native_1.Text style={[
                styles.growthText,
                isPositiveGrowth && styles.growthPositive,
                isNegativeGrowth && styles.growthNegative,
            ]}>
            {isPositiveGrowth ? '+' : ''}
            {growthPercentage.toFixed(1)}%
          </react_native_1.Text>
          <react_native_1.Text style={styles.growthLabel}>month over month</react_native_1.Text>
        </react_native_1.View>)}
    </react_native_1.View>);
};
exports.PointsDisplay = PointsDisplay;
var getStyles = function (size) {
    var pointsFontSize = {
        small: 24,
        medium: 34,
        large: 48,
    }[size];
    var labelFontSize = {
        small: 13,
        medium: 15,
        large: 17,
    }[size];
    var growthFontSize = {
        small: 11,
        medium: 13,
        large: 15,
    }[size];
    return react_native_1.StyleSheet.create({
        container: {
            alignItems: 'center',
        },
        pointsText: {
            fontSize: pointsFontSize,
            fontWeight: '700',
            color: theme_1.colors.textPrimary,
            fontFamily: theme_1.typography.h1.fontFamily,
        },
        labelText: {
            fontSize: labelFontSize,
            fontWeight: '400',
            color: theme_1.colors.textSecondary,
            marginTop: theme_1.spacing.xs,
            fontFamily: theme_1.typography.body2.fontFamily,
        },
        growthContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: theme_1.spacing.xs,
            gap: theme_1.spacing.xs,
        },
        growthText: {
            fontSize: growthFontSize,
            fontWeight: '600',
            fontFamily: theme_1.typography.caption.fontFamily,
        },
        growthPositive: {
            color: theme_1.colors.success,
        },
        growthNegative: {
            color: theme_1.colors.error,
        },
        growthLabel: {
            fontSize: growthFontSize,
            fontWeight: '400',
            color: theme_1.colors.textSecondary,
            fontFamily: theme_1.typography.caption.fontFamily,
        },
    });
};
exports.default = exports.PointsDisplay;
