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
exports.MissionCard = void 0;
var react_1 = __importStar(require("react"));
var react_native_1 = require("react-native");
var theme_1 = require("../theme");
var OptimizedImage_1 = require("./OptimizedImage");
var SCREEN_WIDTH = react_native_1.Dimensions.get('window').width;
var CARD_WIDTH = SCREEN_WIDTH - theme_1.spacing.lg * 2;
var IMAGE_HEIGHT = 200;
var MissionCardComponent = function (_a) {
    var mission = _a.mission, onPress = _a.onPress, onFavoriteToggle = _a.onFavoriteToggle, _b = _a.isFavorite, isFavorite = _b === void 0 ? false : _b;
    var _c = (0, react_1.useState)(0), currentImageIndex = _c[0], setCurrentImageIndex = _c[1];
    var handleScroll = (0, react_1.useCallback)(function (event) {
        var contentOffsetX = event.nativeEvent.contentOffset.x;
        var index = Math.round(contentOffsetX / CARD_WIDTH);
        setCurrentImageIndex(index);
    }, []);
    var handleFavoritePress = (0, react_1.useCallback)(function () {
        if (onFavoriteToggle) {
            onFavoriteToggle(mission.id);
        }
    }, [onFavoriteToggle, mission.id]);
    var formatDate = function (timestamp) {
        var date = timestamp.toDate();
        var month = date.toLocaleDateString('zh-TW', { month: 'long' });
        var day = date.getDate();
        return "".concat(month.replace('月', ''), "\u6708").concat(day, "\u65E5");
    };
    var formatDateForAccessibility = function (timestamp) {
        var date = timestamp.toDate();
        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });
    };
    var accessibilityLabel = "Mission: ".concat(mission.title, ", Date: ").concat(formatDateForAccessibility(mission.date), ", Reward: ").concat(mission.pointsReward, " points").concat(isFavorite ? ', favorited' : '');
    return (<react_native_1.TouchableOpacity style={[styles.card, theme_1.shadows.lg]} onPress={onPress} activeOpacity={0.9} accessible={true} accessibilityRole="button" accessibilityLabel={accessibilityLabel} accessibilityHint="Double tap to view mission details">
      {/* Image Carousel */}
      <react_native_1.View style={styles.imageContainer}>
        <react_native_1.ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} onScroll={handleScroll} scrollEventThrottle={16} removeClippedSubviews={true}>
          {mission.imageUrls.map(function (imageUrl, index) { return (<OptimizedImage_1.OptimizedImage key={index} source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" cachePolicy="memory-disk"/>); })}
        </react_native_1.ScrollView>

        {/* Pagination Dots */}
        {mission.imageUrls.length > 1 && (<react_native_1.View style={styles.paginationContainer}>
            {mission.imageUrls.map(function (_, index) { return (<react_native_1.View key={index} style={[
                    styles.paginationDot,
                    index === currentImageIndex && styles.paginationDotActive,
                ]}/>); })}
          </react_native_1.View>)}

        {/* Favorite Toggle */}
        <react_native_1.TouchableOpacity style={styles.favoriteButton} onPress={handleFavoritePress} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} accessible={true} accessibilityRole="button" accessibilityLabel={isFavorite ? 'Remove from favorites' : 'Add to favorites'} accessibilityHint={"Double tap to ".concat(isFavorite ? 'unfavorite' : 'favorite', " this mission")} accessibilityState={{ selected: isFavorite }}>
          <react_native_1.Text style={styles.favoriteIcon} accessible={false}>
            {isFavorite ? '❤️' : '🤍'}
          </react_native_1.Text>
        </react_native_1.TouchableOpacity>
      </react_native_1.View>

      {/* Content */}
      <react_native_1.View style={styles.content} accessible={false}>
        {/* Date */}
        <react_native_1.Text style={styles.date} accessible={false}>
          {formatDate(mission.date)}
        </react_native_1.Text>

        {/* Title */}
        <react_native_1.Text style={styles.title} numberOfLines={2} accessible={false}>
          {mission.title}
        </react_native_1.Text>

        {/* Description */}
        <react_native_1.Text style={styles.description} numberOfLines={3} accessible={false}>
          {mission.description}
        </react_native_1.Text>

        {/* Points Badge */}
        <react_native_1.View style={styles.pointsBadge} accessible={false}>
          <react_native_1.Text style={styles.pointsText} accessible={false}>
            +{mission.pointsReward} points
          </react_native_1.Text>
        </react_native_1.View>
      </react_native_1.View>
    </react_native_1.TouchableOpacity>);
};
var styles = react_native_1.StyleSheet.create({
    card: {
        backgroundColor: theme_1.colors.white,
        borderRadius: theme_1.borderRadius.lg,
        marginHorizontal: theme_1.spacing.lg,
        marginBottom: theme_1.spacing.md,
        overflow: 'hidden',
    },
    imageContainer: {
        position: 'relative',
        height: IMAGE_HEIGHT,
    },
    image: {
        width: CARD_WIDTH,
        height: IMAGE_HEIGHT,
    },
    paginationContainer: {
        position: 'absolute',
        bottom: theme_1.spacing.sm,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: theme_1.colors.white,
        opacity: 0.5,
        marginHorizontal: 4,
    },
    paginationDotActive: {
        opacity: 1,
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    favoriteButton: {
        position: 'absolute',
        top: theme_1.spacing.md,
        right: theme_1.spacing.md,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    favoriteIcon: {
        fontSize: 20,
    },
    content: {
        padding: theme_1.spacing.md,
    },
    date: __assign(__assign({}, theme_1.typography.h2), { color: theme_1.colors.textPrimary, marginBottom: theme_1.spacing.xs }),
    title: __assign(__assign({}, theme_1.typography.h3), { color: theme_1.colors.textPrimary, marginBottom: theme_1.spacing.sm }),
    description: __assign(__assign({}, theme_1.typography.body2), { color: theme_1.colors.textSecondary, marginBottom: theme_1.spacing.md }),
    pointsBadge: {
        alignSelf: 'flex-start',
        backgroundColor: theme_1.colors.accent,
        paddingHorizontal: theme_1.spacing.md,
        paddingVertical: theme_1.spacing.xs,
        borderRadius: theme_1.borderRadius.md,
    },
    pointsText: __assign(__assign({}, theme_1.typography.button), { fontSize: 14, color: theme_1.colors.white }),
});
// Memoize component to prevent unnecessary re-renders
exports.MissionCard = react_1.default.memo(MissionCardComponent, function (prevProps, nextProps) {
    return (prevProps.mission.id === nextProps.mission.id &&
        prevProps.isFavorite === nextProps.isFavorite &&
        prevProps.mission.imageUrls.length === nextProps.mission.imageUrls.length);
});
