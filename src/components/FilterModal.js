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
exports.FilterModal = void 0;
var react_1 = __importStar(require("react"));
var react_native_1 = require("react-native");
var Button_1 = require("./Button");
var theme_1 = require("../theme");
var CATEGORIES = [
    { value: 'volunteer', label: 'Volunteer' },
    { value: 'donation', label: 'Donation' },
    { value: 'charity', label: 'Charity' },
    { value: 'blood_drive', label: 'Blood Drive' },
    { value: 'other', label: 'Other' },
];
var DATE_RANGES = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'all', label: 'All Time' },
];
var DISTANCES = [
    { value: 5, label: '5 km' },
    { value: 10, label: '10 km' },
    { value: 25, label: '25 km' },
    { value: 50, label: '50 km' },
    { value: 100, label: '100 km' },
];
var FilterModal = function (_a) {
    var visible = _a.visible, currentFilters = _a.currentFilters, onClose = _a.onClose, onApply = _a.onApply;
    var _b = (0, react_1.useState)(currentFilters), filters = _b[0], setFilters = _b[1];
    var handleCategorySelect = function (category) {
        setFilters(function (prev) { return (__assign(__assign({}, prev), { category: prev.category === category ? undefined : category })); });
    };
    var handleDateRangeSelect = function (dateRange) {
        setFilters(function (prev) { return (__assign(__assign({}, prev), { dateRange: prev.dateRange === dateRange ? undefined : dateRange })); });
    };
    var handleDistanceSelect = function (distance) {
        setFilters(function (prev) { return (__assign(__assign({}, prev), { distance: prev.distance === distance ? undefined : distance })); });
    };
    var handleReset = function () {
        setFilters({});
    };
    var handleApply = function () {
        onApply(filters);
        onClose();
    };
    return (<react_native_1.Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <react_native_1.SafeAreaView style={styles.container}>
        {/* Header */}
        <react_native_1.View style={styles.header}>
          <react_native_1.TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <react_native_1.Text style={styles.closeIcon}>✕</react_native_1.Text>
          </react_native_1.TouchableOpacity>
          <react_native_1.Text style={styles.title}>Filters</react_native_1.Text>
          <react_native_1.TouchableOpacity onPress={handleReset}>
            <react_native_1.Text style={styles.resetText}>Reset</react_native_1.Text>
          </react_native_1.TouchableOpacity>
        </react_native_1.View>

        <react_native_1.ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Category Filter */}
          <react_native_1.View style={styles.section}>
            <react_native_1.Text style={styles.sectionTitle}>Category</react_native_1.Text>
            <react_native_1.View style={styles.optionsContainer}>
              {CATEGORIES.map(function (_a) {
            var value = _a.value, label = _a.label;
            return (<react_native_1.TouchableOpacity key={value} style={[
                    styles.option,
                    filters.category === value && styles.optionSelected,
                ]} onPress={function () { return handleCategorySelect(value); }}>
                  <react_native_1.Text style={[
                    styles.optionText,
                    filters.category === value && styles.optionTextSelected,
                ]}>
                    {label}
                  </react_native_1.Text>
                </react_native_1.TouchableOpacity>);
        })}
            </react_native_1.View>
          </react_native_1.View>

          {/* Date Range Filter */}
          <react_native_1.View style={styles.section}>
            <react_native_1.Text style={styles.sectionTitle}>Date Range</react_native_1.Text>
            <react_native_1.View style={styles.optionsContainer}>
              {DATE_RANGES.map(function (_a) {
            var value = _a.value, label = _a.label;
            return (<react_native_1.TouchableOpacity key={value} style={[
                    styles.option,
                    filters.dateRange === value && styles.optionSelected,
                ]} onPress={function () { return handleDateRangeSelect(value); }}>
                  <react_native_1.Text style={[
                    styles.optionText,
                    filters.dateRange === value && styles.optionTextSelected,
                ]}>
                    {label}
                  </react_native_1.Text>
                </react_native_1.TouchableOpacity>);
        })}
            </react_native_1.View>
          </react_native_1.View>

          {/* Distance Filter */}
          <react_native_1.View style={styles.section}>
            <react_native_1.Text style={styles.sectionTitle}>Distance</react_native_1.Text>
            <react_native_1.View style={styles.optionsContainer}>
              {DISTANCES.map(function (_a) {
            var value = _a.value, label = _a.label;
            return (<react_native_1.TouchableOpacity key={value} style={[
                    styles.option,
                    filters.distance === value && styles.optionSelected,
                ]} onPress={function () { return handleDistanceSelect(value); }}>
                  <react_native_1.Text style={[
                    styles.optionText,
                    filters.distance === value && styles.optionTextSelected,
                ]}>
                    {label}
                  </react_native_1.Text>
                </react_native_1.TouchableOpacity>);
        })}
            </react_native_1.View>
          </react_native_1.View>
        </react_native_1.ScrollView>

        {/* Footer */}
        <react_native_1.View style={styles.footer}>
          <Button_1.Button title="Apply Filters" onPress={handleApply}/>
        </react_native_1.View>
      </react_native_1.SafeAreaView>
    </react_native_1.Modal>);
};
exports.FilterModal = FilterModal;
var styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme_1.colors.white,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: theme_1.spacing.lg,
        paddingVertical: theme_1.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme_1.colors.gray200,
    },
    closeButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeIcon: {
        fontSize: 24,
        color: theme_1.colors.textPrimary,
    },
    title: __assign(__assign({}, theme_1.typography.h3), { color: theme_1.colors.textPrimary }),
    resetText: __assign(__assign({}, theme_1.typography.body1), { color: theme_1.colors.accent }),
    content: {
        flex: 1,
        paddingHorizontal: theme_1.spacing.lg,
    },
    section: {
        marginTop: theme_1.spacing.lg,
    },
    sectionTitle: __assign(__assign({}, theme_1.typography.h3), { fontSize: 18, color: theme_1.colors.textPrimary, marginBottom: theme_1.spacing.md }),
    optionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -theme_1.spacing.xs,
    },
    option: {
        paddingHorizontal: theme_1.spacing.md,
        paddingVertical: theme_1.spacing.sm,
        borderRadius: theme_1.borderRadius.md,
        borderWidth: 1,
        borderColor: theme_1.colors.gray300,
        backgroundColor: theme_1.colors.white,
        margin: theme_1.spacing.xs,
    },
    optionSelected: {
        backgroundColor: theme_1.colors.accent,
        borderColor: theme_1.colors.accent,
    },
    optionText: __assign(__assign({}, theme_1.typography.body2), { color: theme_1.colors.textPrimary }),
    optionTextSelected: {
        color: theme_1.colors.white,
    },
    footer: {
        paddingHorizontal: theme_1.spacing.lg,
        paddingVertical: theme_1.spacing.md,
        borderTopWidth: 1,
        borderTopColor: theme_1.colors.gray200,
    },
});
