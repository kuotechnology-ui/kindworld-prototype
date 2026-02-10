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
exports.SortModal = void 0;
var react_1 = __importStar(require("react"));
var react_native_1 = require("react-native");
var Button_1 = require("./Button");
var theme_1 = require("../theme");
var SORT_OPTIONS = [
    {
        value: 'date',
        label: 'Date',
        description: 'Sort by event date (earliest first)',
    },
    {
        value: 'relevance',
        label: 'Relevance',
        description: 'Sort by most relevant to you',
    },
    {
        value: 'distance',
        label: 'Distance',
        description: 'Sort by closest to your location',
    },
];
var SortModal = function (_a) {
    var visible = _a.visible, currentSort = _a.currentSort, onClose = _a.onClose, onApply = _a.onApply;
    var _b = (0, react_1.useState)(currentSort), selectedSort = _b[0], setSelectedSort = _b[1];
    var handleApply = function () {
        onApply(selectedSort);
        onClose();
    };
    return (<react_native_1.Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <react_native_1.View style={styles.overlay}>
        <react_native_1.TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose}/>
        <react_native_1.SafeAreaView style={styles.container}>
          {/* Header */}
          <react_native_1.View style={styles.header}>
            <react_native_1.Text style={styles.title}>Sort By</react_native_1.Text>
            <react_native_1.TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <react_native_1.Text style={styles.closeIcon}>✕</react_native_1.Text>
            </react_native_1.TouchableOpacity>
          </react_native_1.View>

          {/* Sort Options */}
          <react_native_1.View style={styles.content}>
            {SORT_OPTIONS.map(function (_a) {
            var value = _a.value, label = _a.label, description = _a.description;
            return (<react_native_1.TouchableOpacity key={value} style={[
                    styles.option,
                    selectedSort === value && styles.optionSelected,
                ]} onPress={function () { return setSelectedSort(value); }}>
                <react_native_1.View style={styles.optionContent}>
                  <react_native_1.Text style={[
                    styles.optionLabel,
                    selectedSort === value && styles.optionLabelSelected,
                ]}>
                    {label}
                  </react_native_1.Text>
                  <react_native_1.Text style={styles.optionDescription}>{description}</react_native_1.Text>
                </react_native_1.View>
                {selectedSort === value && (<react_native_1.Text style={styles.checkmark}>✓</react_native_1.Text>)}
              </react_native_1.TouchableOpacity>);
        })}
          </react_native_1.View>

          {/* Footer */}
          <react_native_1.View style={styles.footer}>
            <Button_1.Button title="Apply" onPress={handleApply}/>
          </react_native_1.View>
        </react_native_1.SafeAreaView>
      </react_native_1.View>
    </react_native_1.Modal>);
};
exports.SortModal = SortModal;
var styles = react_native_1.StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    backdrop: __assign(__assign({}, react_native_1.StyleSheet.absoluteFillObject), { backgroundColor: 'rgba(0, 0, 0, 0.5)' }),
    container: {
        backgroundColor: theme_1.colors.white,
        borderTopLeftRadius: theme_1.borderRadius.xl,
        borderTopRightRadius: theme_1.borderRadius.xl,
        maxHeight: '70%',
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
    title: __assign(__assign({}, theme_1.typography.h3), { color: theme_1.colors.textPrimary }),
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
    content: {
        paddingHorizontal: theme_1.spacing.lg,
        paddingVertical: theme_1.spacing.md,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: theme_1.spacing.md,
        paddingHorizontal: theme_1.spacing.md,
        borderRadius: theme_1.borderRadius.md,
        marginBottom: theme_1.spacing.sm,
        backgroundColor: theme_1.colors.white,
        borderWidth: 1,
        borderColor: theme_1.colors.gray200,
    },
    optionSelected: {
        backgroundColor: theme_1.colors.gray100,
        borderColor: theme_1.colors.accent,
    },
    optionContent: {
        flex: 1,
    },
    optionLabel: __assign(__assign({}, theme_1.typography.body1), { fontWeight: '600', color: theme_1.colors.textPrimary, marginBottom: theme_1.spacing.xs }),
    optionLabelSelected: {
        color: theme_1.colors.accent,
    },
    optionDescription: __assign(__assign({}, theme_1.typography.caption), { color: theme_1.colors.textSecondary }),
    checkmark: {
        fontSize: 20,
        color: theme_1.colors.accent,
        marginLeft: theme_1.spacing.md,
    },
    footer: {
        paddingHorizontal: theme_1.spacing.lg,
        paddingVertical: theme_1.spacing.md,
        borderTopWidth: 1,
        borderTopColor: theme_1.colors.gray200,
    },
});
