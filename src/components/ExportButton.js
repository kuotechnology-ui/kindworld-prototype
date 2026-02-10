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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExportButton = void 0;
var react_1 = __importStar(require("react"));
var react_native_1 = require("react-native");
var theme_1 = require("../theme");
var ExportButton = function (_a) {
    var onExport = _a.onExport, _b = _a.disabled, disabled = _b === void 0 ? false : _b;
    var _c = (0, react_1.useState)(false), showModal = _c[0], setShowModal = _c[1];
    var _d = (0, react_1.useState)(false), isExporting = _d[0], setIsExporting = _d[1];
    var handleExport = function (format) { return __awaiter(void 0, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setIsExporting(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, onExport(format)];
                case 2:
                    _a.sent();
                    setShowModal(false);
                    react_native_1.Alert.alert('Export Successful', "Your data has been exported as ".concat(format.toUpperCase(), "."), [{ text: 'OK' }]);
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    react_native_1.Alert.alert('Export Failed', error_1 instanceof Error ? error_1.message : 'An error occurred while exporting data.', [{ text: 'OK' }]);
                    return [3 /*break*/, 5];
                case 4:
                    setIsExporting(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    return (<>
      <react_native_1.TouchableOpacity style={[styles.exportButton, disabled && styles.exportButtonDisabled]} onPress={function () { return setShowModal(true); }} disabled={disabled}>
        <react_native_1.Text style={styles.exportButtonText}>📊 Export Data</react_native_1.Text>
      </react_native_1.TouchableOpacity>

      <react_native_1.Modal visible={showModal} animationType="fade" transparent={true} onRequestClose={function () { return !isExporting && setShowModal(false); }}>
        <react_native_1.View style={styles.modalOverlay}>
          <react_native_1.View style={styles.modalContent}>
            <react_native_1.Text style={styles.modalTitle}>Export Format</react_native_1.Text>
            <react_native_1.Text style={styles.modalSubtitle}>
              Choose a format to export your analytics data
            </react_native_1.Text>

            {isExporting ? (<react_native_1.View style={styles.loadingContainer}>
                <react_native_1.ActivityIndicator size="large" color={theme_1.colors.accent}/>
                <react_native_1.Text style={styles.loadingText}>Exporting data...</react_native_1.Text>
              </react_native_1.View>) : (<>
                <react_native_1.TouchableOpacity style={styles.formatOption} onPress={function () { return handleExport('csv'); }}>
                  <react_native_1.View style={styles.formatIcon}>
                    <react_native_1.Text style={styles.formatIconText}>📄</react_native_1.Text>
                  </react_native_1.View>
                  <react_native_1.View style={styles.formatInfo}>
                    <react_native_1.Text style={styles.formatTitle}>CSV</react_native_1.Text>
                    <react_native_1.Text style={styles.formatDescription}>
                      Comma-separated values, ideal for Excel and data analysis
                    </react_native_1.Text>
                  </react_native_1.View>
                </react_native_1.TouchableOpacity>

                <react_native_1.TouchableOpacity style={styles.formatOption} onPress={function () { return handleExport('pdf'); }}>
                  <react_native_1.View style={styles.formatIcon}>
                    <react_native_1.Text style={styles.formatIconText}>📋</react_native_1.Text>
                  </react_native_1.View>
                  <react_native_1.View style={styles.formatInfo}>
                    <react_native_1.Text style={styles.formatTitle}>PDF</react_native_1.Text>
                    <react_native_1.Text style={styles.formatDescription}>
                      Formatted report, ideal for presentations and sharing
                    </react_native_1.Text>
                  </react_native_1.View>
                </react_native_1.TouchableOpacity>

                <react_native_1.TouchableOpacity style={styles.cancelButton} onPress={function () { return setShowModal(false); }}>
                  <react_native_1.Text style={styles.cancelButtonText}>Cancel</react_native_1.Text>
                </react_native_1.TouchableOpacity>
              </>)}
          </react_native_1.View>
        </react_native_1.View>
      </react_native_1.Modal>
    </>);
};
exports.ExportButton = ExportButton;
var styles = react_native_1.StyleSheet.create({
    exportButton: __assign({ backgroundColor: theme_1.colors.accent, paddingHorizontal: theme_1.spacing.md, paddingVertical: theme_1.spacing.sm, borderRadius: theme_1.borderRadius.md }, theme_1.shadows.sm),
    exportButtonDisabled: {
        backgroundColor: theme_1.colors.gray300,
    },
    exportButtonText: __assign(__assign({}, theme_1.typography.button), { color: theme_1.colors.white, textAlign: 'center' }),
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme_1.spacing.md,
    },
    modalContent: __assign({ backgroundColor: theme_1.colors.white, borderRadius: theme_1.borderRadius.lg, padding: theme_1.spacing.lg, width: '100%', maxWidth: 400 }, theme_1.shadows.lg),
    modalTitle: __assign(__assign({}, theme_1.typography.h3), { color: theme_1.colors.textPrimary, marginBottom: theme_1.spacing.xs }),
    modalSubtitle: __assign(__assign({}, theme_1.typography.body2), { color: theme_1.colors.textSecondary, marginBottom: theme_1.spacing.lg }),
    formatOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme_1.spacing.md,
        backgroundColor: theme_1.colors.gray100,
        borderRadius: theme_1.borderRadius.md,
        marginBottom: theme_1.spacing.sm,
    },
    formatIcon: {
        width: 48,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: theme_1.spacing.md,
    },
    formatIconText: {
        fontSize: 32,
    },
    formatInfo: {
        flex: 1,
    },
    formatTitle: __assign(__assign({}, theme_1.typography.body1), { color: theme_1.colors.textPrimary, fontWeight: '600', marginBottom: theme_1.spacing.xs }),
    formatDescription: __assign(__assign({}, theme_1.typography.caption), { color: theme_1.colors.textSecondary, lineHeight: 16 }),
    cancelButton: {
        marginTop: theme_1.spacing.md,
        padding: theme_1.spacing.sm,
        alignItems: 'center',
    },
    cancelButtonText: __assign(__assign({}, theme_1.typography.button), { color: theme_1.colors.textSecondary }),
    loadingContainer: {
        alignItems: 'center',
        paddingVertical: theme_1.spacing.xl,
    },
    loadingText: __assign(__assign({}, theme_1.typography.body2), { color: theme_1.colors.textSecondary, marginTop: theme_1.spacing.md }),
});
