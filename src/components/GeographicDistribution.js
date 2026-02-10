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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeographicDistribution = void 0;
var react_1 = __importDefault(require("react"));
var react_native_1 = require("react-native");
var theme_1 = require("../theme");
var GeographicDistribution = function (_a) {
    var _b;
    var data = _a.data;
    // Sort by participants descending
    var sortedData = __spreadArray([], data, true).sort(function (a, b) { return b.participants - a.participants; });
    // Calculate max for bar width
    var maxParticipants = ((_b = sortedData[0]) === null || _b === void 0 ? void 0 : _b.participants) || 1;
    var renderItem = function (_a) {
        var item = _a.item;
        var barWidth = (item.participants / maxParticipants) * 100;
        return (<react_native_1.View style={styles.locationItem}>
        <react_native_1.View style={styles.locationHeader}>
          <react_native_1.Text style={styles.cityName}>{item.city}</react_native_1.Text>
          <react_native_1.Text style={styles.participantCount}>
            {item.participants.toLocaleString()}
          </react_native_1.Text>
        </react_native_1.View>
        <react_native_1.View style={styles.barContainer}>
          <react_native_1.View style={[styles.bar, { width: "".concat(barWidth, "%") }]}/>
        </react_native_1.View>
      </react_native_1.View>);
    };
    return (<react_native_1.View style={styles.container}>
      <react_native_1.FlatList data={sortedData} renderItem={renderItem} keyExtractor={function (item) { return item.city; }} scrollEnabled={false} ItemSeparatorComponent={function () { return <react_native_1.View style={styles.separator}/>; }}/>
    </react_native_1.View>);
};
exports.GeographicDistribution = GeographicDistribution;
var styles = react_native_1.StyleSheet.create({
    container: {
        width: '100%',
    },
    locationItem: {
        paddingVertical: theme_1.spacing.sm,
    },
    locationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme_1.spacing.xs,
    },
    cityName: __assign(__assign({}, theme_1.typography.body1), { color: theme_1.colors.textPrimary, fontWeight: '600' }),
    participantCount: __assign(__assign({}, theme_1.typography.body2), { color: theme_1.colors.textSecondary, fontWeight: '500' }),
    barContainer: {
        height: 8,
        backgroundColor: theme_1.colors.gray200,
        borderRadius: theme_1.borderRadius.sm,
        overflow: 'hidden',
    },
    bar: {
        height: '100%',
        backgroundColor: theme_1.colors.accent,
        borderRadius: theme_1.borderRadius.sm,
    },
    separator: {
        height: theme_1.spacing.sm,
    },
});
