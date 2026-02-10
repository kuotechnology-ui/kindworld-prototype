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
exports.DashboardSkeleton = exports.SkeletonLoader = void 0;
var react_1 = __importStar(require("react"));
var react_native_1 = require("react-native");
var theme_1 = require("../theme");
var SkeletonLoader = function (_a) {
    var _b = _a.width, width = _b === void 0 ? '100%' : _b, _c = _a.height, height = _c === void 0 ? 20 : _c, _d = _a.borderRadius, radius = _d === void 0 ? theme_1.borderRadius.sm : _d, style = _a.style;
    var animatedValue = (0, react_1.useRef)(new react_native_1.Animated.Value(0)).current;
    (0, react_1.useEffect)(function () {
        var animation = react_native_1.Animated.loop(react_native_1.Animated.sequence([
            react_native_1.Animated.timing(animatedValue, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            react_native_1.Animated.timing(animatedValue, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true,
            }),
        ]));
        animation.start();
        return function () { return animation.stop(); };
    }, [animatedValue]);
    var opacity = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.7],
    });
    return (<react_native_1.Animated.View style={[
            styles.skeleton,
            {
                width: width,
                height: height,
                borderRadius: radius,
                opacity: opacity,
            },
            style,
        ]}/>);
};
exports.SkeletonLoader = SkeletonLoader;
var DashboardSkeleton = function () {
    return (<react_native_1.View style={styles.container}>
      {/* Top bar skeleton */}
      <react_native_1.View style={styles.topBar}>
        <exports.SkeletonLoader width={24} height={24}/>
        <exports.SkeletonLoader width={120} height={24}/>
        <exports.SkeletonLoader width={32} height={32} borderRadius={16}/>
      </react_native_1.View>

      {/* Month selector skeleton */}
      <react_native_1.View style={styles.monthSelector}>
        <exports.SkeletonLoader width={100} height={32} borderRadius={16} style={styles.pill}/>
        <exports.SkeletonLoader width={100} height={32} borderRadius={16} style={styles.pill}/>
        <exports.SkeletonLoader width={100} height={32} borderRadius={16}/>
      </react_native_1.View>

      {/* Points card skeleton */}
      <react_native_1.View style={styles.pointsCard}>
        <exports.SkeletonLoader width={200} height={48} style={styles.centered}/>
        <exports.SkeletonLoader width={60} height={20} style={styles.centered}/>
        <exports.SkeletonLoader width={180} height={16} style={styles.centered}/>
        <exports.SkeletonLoader width={120} height={20} style={styles.centered}/>
      </react_native_1.View>

      {/* Chart skeleton */}
      <react_native_1.View style={styles.section}>
        <exports.SkeletonLoader width={150} height={24}/>
        <exports.SkeletonLoader width="100%" height={200} style={styles.chart}/>
      </react_native_1.View>

      {/* Leaderboard skeleton */}
      <react_native_1.View style={styles.section}>
        <exports.SkeletonLoader width={120} height={24}/>
        <react_native_1.View style={styles.leaderboardItems}>
          {[1, 2, 3, 4, 5].map(function (i) { return (<react_native_1.View key={i} style={styles.leaderboardItem}>
              <exports.SkeletonLoader width={32} height={32} borderRadius={16}/>
              <exports.SkeletonLoader width={32} height={32} borderRadius={16} style={styles.avatar}/>
              <react_native_1.View style={styles.leaderboardInfo}>
                <exports.SkeletonLoader width="60%" height={16}/>
                <exports.SkeletonLoader width="40%" height={14} style={styles.points}/>
              </react_native_1.View>
            </react_native_1.View>); })}
        </react_native_1.View>
      </react_native_1.View>
    </react_native_1.View>);
};
exports.DashboardSkeleton = DashboardSkeleton;
var styles = react_native_1.StyleSheet.create({
    skeleton: {
        backgroundColor: theme_1.colors.gray200,
    },
    container: {
        flex: 1,
        backgroundColor: theme_1.colors.white,
        padding: theme_1.spacing.md,
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme_1.spacing.md,
    },
    monthSelector: {
        flexDirection: 'row',
        marginBottom: theme_1.spacing.lg,
    },
    pill: {
        marginRight: theme_1.spacing.sm,
    },
    pointsCard: {
        padding: theme_1.spacing.lg,
        backgroundColor: theme_1.colors.gray100,
        borderRadius: theme_1.borderRadius.lg,
        alignItems: 'center',
        marginBottom: theme_1.spacing.xl,
    },
    centered: {
        marginVertical: theme_1.spacing.xs,
    },
    section: {
        marginBottom: theme_1.spacing.xl,
    },
    chart: {
        marginTop: theme_1.spacing.md,
    },
    leaderboardItems: {
        marginTop: theme_1.spacing.md,
    },
    leaderboardItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme_1.spacing.md,
    },
    avatar: {
        marginLeft: theme_1.spacing.sm,
    },
    leaderboardInfo: {
        flex: 1,
        marginLeft: theme_1.spacing.sm,
    },
    points: {
        marginTop: theme_1.spacing.xs,
    },
});
