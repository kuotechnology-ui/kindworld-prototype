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
var react_1 = __importDefault(require("react"));
var react_native_1 = require("react-native");
var theme_1 = require("../theme");
var TabIcon = function (_a) {
    var focused = _a.focused, label = _a.label, badgeCount = _a.badgeCount;
    var iconMap = {
        Home: '🏠',
        Search: '🔍',
        Activity: '📊',
        Profile: '👤',
    };
    return (<react_native_1.View style={styles.tabIconContainer}>
      <react_native_1.Text style={[styles.icon, focused && styles.iconFocused]}>
        {iconMap[label] || '•'}
      </react_native_1.Text>
      {badgeCount !== undefined && badgeCount > 0 && (<react_native_1.View style={styles.badge}>
          <react_native_1.Text style={styles.badgeText}>
            {badgeCount > 99 ? '99+' : badgeCount}
          </react_native_1.Text>
        </react_native_1.View>)}
    </react_native_1.View>);
};
var BottomNav = function (_a) {
    var state = _a.state, descriptors = _a.descriptors, navigation = _a.navigation;
    return (<react_native_1.View style={styles.container}>
      {state.routes.map(function (route, index) {
            var options = descriptors[route.key].options;
            var label = options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                    ? options.title
                    : route.name;
            var isFocused = state.index === index;
            // Get badge count from options if provided
            var badgeCount = options.tabBarBadge;
            var onPress = function () {
                var event = navigation.emit({
                    type: 'tabPress',
                    target: route.key,
                    canPreventDefault: true,
                });
                if (!isFocused && !event.defaultPrevented) {
                    navigation.navigate(route.name);
                }
            };
            var onLongPress = function () {
                navigation.emit({
                    type: 'tabLongPress',
                    target: route.key,
                });
            };
            var tabAccessibilityLabel = options.tabBarAccessibilityLabel ||
                "".concat(String(label), " tab").concat(isFocused ? ', selected' : '').concat(badgeCount ? ", ".concat(badgeCount, " notifications") : '');
            return (<react_native_1.TouchableOpacity key={route.key} accessible={true} accessibilityRole="tab" accessibilityState={{ selected: isFocused }} accessibilityLabel={tabAccessibilityLabel} accessibilityHint={"Navigate to ".concat(String(label))} testID={options.tabBarTestID} onPress={onPress} onLongPress={onLongPress} style={styles.tab} activeOpacity={0.7}>
            <react_native_1.Animated.View style={styles.tabContent}>
              <TabIcon focused={isFocused} label={String(label)} badgeCount={badgeCount}/>
              <react_native_1.Text style={[
                    styles.label,
                    isFocused ? styles.labelFocused : styles.labelUnfocused,
                ]} accessible={false}>
                {String(label)}
              </react_native_1.Text>
            </react_native_1.Animated.View>
          </react_native_1.TouchableOpacity>);
        })}
    </react_native_1.View>);
};
var styles = react_native_1.StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: theme_1.colors.white,
        borderTopWidth: 1,
        borderTopColor: theme_1.colors.gray200,
        paddingBottom: theme_1.spacing.sm,
        paddingTop: theme_1.spacing.sm,
        elevation: 8,
        shadowColor: theme_1.colors.black,
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 56, // Exceeds 44pt minimum touch target
    },
    tabContent: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabIconContainer: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: theme_1.spacing.xs,
    },
    icon: {
        fontSize: 24,
        opacity: 0.5,
    },
    iconFocused: {
        opacity: 1,
    },
    label: __assign(__assign({}, theme_1.typography.caption), { fontSize: 11 }),
    labelFocused: {
        color: theme_1.colors.primary,
        fontWeight: '600',
    },
    labelUnfocused: {
        color: theme_1.colors.textSecondary,
        fontWeight: '400',
    },
    badge: {
        position: 'absolute',
        top: -4,
        right: -12,
        backgroundColor: theme_1.colors.error,
        borderRadius: 10,
        minWidth: 18,
        height: 18,
        paddingHorizontal: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    badgeText: {
        color: theme_1.colors.white,
        fontSize: 10,
        fontWeight: '600',
    },
});
exports.default = BottomNav;
