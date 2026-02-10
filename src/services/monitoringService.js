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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.monitoringService = exports.ErrorSeverity = exports.PerformanceTrace = exports.AnalyticsEvent = void 0;
var analytics_1 = __importDefault(require("@react-native-firebase/analytics"));
var crashlytics_1 = __importDefault(require("@react-native-firebase/crashlytics"));
var perf_1 = __importDefault(require("@react-native-firebase/perf"));
/**
 * MonitoringService
 *
 * Centralized service for Firebase Analytics, Crashlytics, and Performance Monitoring
 * Tracks user behavior, errors, and performance metrics across the app
 */
// Analytics Event Names
var AnalyticsEvent;
(function (AnalyticsEvent) {
    // Authentication Events
    AnalyticsEvent["SIGN_IN"] = "sign_in";
    AnalyticsEvent["SIGN_UP"] = "sign_up";
    AnalyticsEvent["SIGN_OUT"] = "sign_out";
    // Mission Events
    AnalyticsEvent["MISSION_VIEW"] = "mission_view";
    AnalyticsEvent["MISSION_JOIN"] = "mission_join";
    AnalyticsEvent["MISSION_COMPLETE"] = "mission_complete";
    AnalyticsEvent["MISSION_FILTER"] = "mission_filter";
    AnalyticsEvent["MISSION_SORT"] = "mission_sort";
    AnalyticsEvent["MISSION_SEARCH"] = "mission_search";
    // Points Events
    AnalyticsEvent["POINTS_EARNED"] = "points_earned";
    AnalyticsEvent["POINTS_SPENT"] = "points_spent";
    AnalyticsEvent["POINTS_VIEW_HISTORY"] = "points_view_history";
    // Profile Events
    AnalyticsEvent["PROFILE_VIEW"] = "profile_view";
    AnalyticsEvent["PROFILE_EDIT"] = "profile_edit";
    AnalyticsEvent["BADGE_EARNED"] = "badge_earned";
    // Dashboard Events
    AnalyticsEvent["DASHBOARD_VIEW"] = "dashboard_view";
    AnalyticsEvent["LEADERBOARD_VIEW"] = "leaderboard_view";
    // Admin Events
    AnalyticsEvent["ADMIN_MISSION_CREATE"] = "admin_mission_create";
    AnalyticsEvent["ADMIN_MISSION_UPDATE"] = "admin_mission_update";
    AnalyticsEvent["ADMIN_MISSION_DELETE"] = "admin_mission_delete";
    // CSR Events
    AnalyticsEvent["CSR_DASHBOARD_VIEW"] = "csr_dashboard_view";
    AnalyticsEvent["CSR_EXPORT_DATA"] = "csr_export_data";
    // Error Events
    AnalyticsEvent["ERROR_OCCURRED"] = "error_occurred";
    AnalyticsEvent["API_ERROR"] = "api_error";
})(AnalyticsEvent = exports.AnalyticsEvent || (exports.AnalyticsEvent = {}));
// Performance Trace Names
var PerformanceTrace;
(function (PerformanceTrace) {
    PerformanceTrace["APP_START"] = "app_start";
    PerformanceTrace["SCREEN_LOAD"] = "screen_load";
    PerformanceTrace["API_CALL"] = "api_call";
    PerformanceTrace["IMAGE_LOAD"] = "image_load";
    PerformanceTrace["DATA_FETCH"] = "data_fetch";
})(PerformanceTrace = exports.PerformanceTrace || (exports.PerformanceTrace = {}));
// Error Severity Levels
var ErrorSeverity;
(function (ErrorSeverity) {
    ErrorSeverity["INFO"] = "info";
    ErrorSeverity["WARNING"] = "warning";
    ErrorSeverity["ERROR"] = "error";
    ErrorSeverity["FATAL"] = "fatal";
})(ErrorSeverity = exports.ErrorSeverity || (exports.ErrorSeverity = {}));
var MonitoringService = /** @class */ (function () {
    function MonitoringService() {
        this.isInitialized = false;
        this.performanceTraces = new Map();
    }
    /**
     * Initialize monitoring services
     */
    MonitoringService.prototype.initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        // Enable Crashlytics collection
                        return [4 /*yield*/, (0, crashlytics_1.default)().setCrashlyticsCollectionEnabled(true)];
                    case 1:
                        // Enable Crashlytics collection
                        _a.sent();
                        // Enable Analytics collection
                        return [4 /*yield*/, (0, analytics_1.default)().setAnalyticsCollectionEnabled(true)];
                    case 2:
                        // Enable Analytics collection
                        _a.sent();
                        // Enable Performance Monitoring
                        return [4 /*yield*/, (0, perf_1.default)().setPerformanceCollectionEnabled(true)];
                    case 3:
                        // Enable Performance Monitoring
                        _a.sent();
                        this.isInitialized = true;
                        console.log('Monitoring services initialized successfully');
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _a.sent();
                        console.error('Failed to initialize monitoring services:', error_1);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Set user ID for tracking across all services
     */
    MonitoringService.prototype.setUserId = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, Promise.all([
                                (0, analytics_1.default)().setUserId(userId),
                                (0, crashlytics_1.default)().setUserId(userId),
                            ])];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        console.error('Failed to set user ID:', error_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Set user properties for analytics
     */
    MonitoringService.prototype.setUserProperties = function (properties) {
        return __awaiter(this, void 0, void 0, function () {
            var error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, analytics_1.default)().setUserProperties(properties)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        console.error('Failed to set user properties:', error_3);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Clear user data (on logout)
     */
    MonitoringService.prototype.clearUserData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, Promise.all([
                                (0, analytics_1.default)().setUserId(null),
                                (0, crashlytics_1.default)().setUserId(''),
                            ])];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        console.error('Failed to clear user data:', error_4);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // ==================== Analytics Methods ====================
    /**
     * Log a custom analytics event
     */
    MonitoringService.prototype.logEvent = function (eventName, params) {
        return __awaiter(this, void 0, void 0, function () {
            var error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, analytics_1.default)().logEvent(eventName, params)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_5 = _a.sent();
                        console.error("Failed to log event ".concat(eventName, ":"), error_5);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Log screen view
     */
    MonitoringService.prototype.logScreenView = function (screenName, screenClass) {
        return __awaiter(this, void 0, void 0, function () {
            var error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, analytics_1.default)().logScreenView({
                                screen_name: screenName,
                                screen_class: screenClass || screenName,
                            })];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_6 = _a.sent();
                        console.error("Failed to log screen view ".concat(screenName, ":"), error_6);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Log mission join event
     */
    MonitoringService.prototype.logMissionJoin = function (missionId, missionTitle, pointsReward) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.logEvent(AnalyticsEvent.MISSION_JOIN, {
                            mission_id: missionId,
                            mission_title: missionTitle,
                            points_reward: pointsReward,
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Log mission completion event
     */
    MonitoringService.prototype.logMissionComplete = function (missionId, missionTitle, pointsEarned) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.logEvent(AnalyticsEvent.MISSION_COMPLETE, {
                            mission_id: missionId,
                            mission_title: missionTitle,
                            points_earned: pointsEarned,
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Log voucher redemption event — REMOVED
     *
     * Voucher redemption tracking has been removed. This stub remains to avoid
     * runtime errors if an unexpected call remains; it will no-op and log a warning.
     */
    MonitoringService.prototype.logVoucherRedeem = function () {
        var _args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _args[_i] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.warn('logVoucherRedeem called but voucher tracking is removed');
                return [2 /*return*/];
            });
        });
    };
    /**
     * Log points earned event
     */
    MonitoringService.prototype.logPointsEarned = function (amount, source) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.logEvent(AnalyticsEvent.POINTS_EARNED, {
                            amount: amount,
                            source: source,
                            value: amount,
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Log points spent event
     */
    MonitoringService.prototype.logPointsSpent = function (amount, purpose) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.logEvent(AnalyticsEvent.POINTS_SPENT, {
                            amount: amount,
                            purpose: purpose,
                            value: amount,
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Log sign in event
     */
    MonitoringService.prototype.logSignIn = function (method) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.logEvent(AnalyticsEvent.SIGN_IN, {
                            method: method,
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Log sign up event
     */
    MonitoringService.prototype.logSignUp = function (method) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.logEvent(AnalyticsEvent.SIGN_UP, {
                            method: method,
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // ==================== Crashlytics Methods ====================
    /**
     * Log a non-fatal error
     */
    MonitoringService.prototype.logError = function (error, context) {
        return __awaiter(this, void 0, void 0, function () {
            var err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        // Set context attributes
                        if (context) {
                            Object.entries(context).forEach(function (_a) {
                                var key = _a[0], value = _a[1];
                                (0, crashlytics_1.default)().setAttribute(key, String(value));
                            });
                        }
                        // Record the error
                        return [4 /*yield*/, (0, crashlytics_1.default)().recordError(error)];
                    case 1:
                        // Record the error
                        _a.sent();
                        // Also log to analytics for tracking
                        return [4 /*yield*/, this.logEvent(AnalyticsEvent.ERROR_OCCURRED, {
                                error_message: error.message,
                                error_name: error.name,
                                screen: context === null || context === void 0 ? void 0 : context.screen,
                            })];
                    case 2:
                        // Also log to analytics for tracking
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        console.error('Failed to log error to Crashlytics:', err_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Log a custom message to Crashlytics
     */
    MonitoringService.prototype.log = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, crashlytics_1.default)().log(message)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_7 = _a.sent();
                        console.error('Failed to log message to Crashlytics:', error_7);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Set custom attributes for crash reports
     */
    MonitoringService.prototype.setAttribute = function (key, value) {
        return __awaiter(this, void 0, void 0, function () {
            var error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, crashlytics_1.default)().setAttribute(key, value)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_8 = _a.sent();
                        console.error('Failed to set attribute:', error_8);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Set multiple custom attributes
     */
    MonitoringService.prototype.setAttributes = function (attributes) {
        return __awaiter(this, void 0, void 0, function () {
            var error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, crashlytics_1.default)().setAttributes(attributes)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_9 = _a.sent();
                        console.error('Failed to set attributes:', error_9);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Log API error
     */
    MonitoringService.prototype.logApiError = function (endpoint, statusCode, errorMessage, context) {
        return __awaiter(this, void 0, void 0, function () {
            var error;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        error = new Error("API Error: ".concat(endpoint, " - ").concat(statusCode, " - ").concat(errorMessage));
                        error.name = 'APIError';
                        return [4 /*yield*/, this.logError(error, __assign(__assign({}, context), { endpoint: endpoint, status_code: statusCode, error_type: 'api' }))];
                    case 1:
                        _a.sent();
                        // Also log to analytics
                        return [4 /*yield*/, this.logEvent(AnalyticsEvent.API_ERROR, {
                                endpoint: endpoint,
                                status_code: statusCode,
                                error_message: errorMessage,
                            })];
                    case 2:
                        // Also log to analytics
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // ==================== Performance Monitoring Methods ====================
    /**
     * Start a performance trace
     */
    MonitoringService.prototype.startTrace = function (traceName) {
        return __awaiter(this, void 0, void 0, function () {
            var trace, error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, perf_1.default)().startTrace(traceName)];
                    case 1:
                        trace = _a.sent();
                        this.performanceTraces.set(traceName, trace);
                        return [3 /*break*/, 3];
                    case 2:
                        error_10 = _a.sent();
                        console.error("Failed to start trace ".concat(traceName, ":"), error_10);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Stop a performance trace
     */
    MonitoringService.prototype.stopTrace = function (traceName) {
        return __awaiter(this, void 0, void 0, function () {
            var trace, error_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        trace = this.performanceTraces.get(traceName);
                        if (!trace) return [3 /*break*/, 2];
                        return [4 /*yield*/, trace.stop()];
                    case 1:
                        _a.sent();
                        this.performanceTraces.delete(traceName);
                        _a.label = 2;
                    case 2: return [3 /*break*/, 4];
                    case 3:
                        error_11 = _a.sent();
                        console.error("Failed to stop trace ".concat(traceName, ":"), error_11);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Add metric to a trace
     */
    MonitoringService.prototype.putTraceMetric = function (traceName, metricName, value) {
        return __awaiter(this, void 0, void 0, function () {
            var trace, error_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        trace = this.performanceTraces.get(traceName);
                        if (!trace) return [3 /*break*/, 2];
                        return [4 /*yield*/, trace.putMetric(metricName, value)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [3 /*break*/, 4];
                    case 3:
                        error_12 = _a.sent();
                        console.error("Failed to put metric ".concat(metricName, " on trace ").concat(traceName, ":"), error_12);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Add attribute to a trace
     */
    MonitoringService.prototype.putTraceAttribute = function (traceName, attribute, value) {
        return __awaiter(this, void 0, void 0, function () {
            var trace, error_13;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        trace = this.performanceTraces.get(traceName);
                        if (!trace) return [3 /*break*/, 2];
                        return [4 /*yield*/, trace.putAttribute(attribute, value)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [3 /*break*/, 4];
                    case 3:
                        error_13 = _a.sent();
                        console.error("Failed to put attribute ".concat(attribute, " on trace ").concat(traceName, ":"), error_13);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Measure screen load time
     */
    MonitoringService.prototype.measureScreenLoad = function (screenName, startTime) {
        return __awaiter(this, void 0, void 0, function () {
            var loadTime, traceName, trace, error_14;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        loadTime = Date.now() - startTime;
                        traceName = "".concat(PerformanceTrace.SCREEN_LOAD, "_").concat(screenName);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 7, , 8]);
                        return [4 /*yield*/, (0, perf_1.default)().startTrace(traceName)];
                    case 2:
                        trace = _a.sent();
                        return [4 /*yield*/, trace.putMetric('load_time_ms', loadTime)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, trace.putAttribute('screen_name', screenName)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, trace.stop()];
                    case 5:
                        _a.sent();
                        // Log to analytics as well
                        return [4 /*yield*/, this.logEvent('screen_load_time', {
                                screen_name: screenName,
                                load_time_ms: loadTime,
                            })];
                    case 6:
                        // Log to analytics as well
                        _a.sent();
                        return [3 /*break*/, 8];
                    case 7:
                        error_14 = _a.sent();
                        console.error("Failed to measure screen load for ".concat(screenName, ":"), error_14);
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Measure API call performance
     */
    MonitoringService.prototype.measureApiCall = function (endpoint, method, startTime, statusCode) {
        return __awaiter(this, void 0, void 0, function () {
            var responseTime, traceName, trace, error_15;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        responseTime = Date.now() - startTime;
                        traceName = "".concat(PerformanceTrace.API_CALL, "_").concat(method, "_").concat(endpoint.replace(/\//g, '_'));
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 10, , 11]);
                        return [4 /*yield*/, (0, perf_1.default)().startTrace(traceName)];
                    case 2:
                        trace = _a.sent();
                        return [4 /*yield*/, trace.putMetric('response_time_ms', responseTime)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, trace.putAttribute('endpoint', endpoint)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, trace.putAttribute('method', method)];
                    case 5:
                        _a.sent();
                        if (!statusCode) return [3 /*break*/, 7];
                        return [4 /*yield*/, trace.putAttribute('status_code', String(statusCode))];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7: return [4 /*yield*/, trace.stop()];
                    case 8:
                        _a.sent();
                        // Log to analytics
                        return [4 /*yield*/, this.logEvent('api_response_time', {
                                endpoint: endpoint,
                                method: method,
                                response_time_ms: responseTime,
                                status_code: statusCode,
                            })];
                    case 9:
                        // Log to analytics
                        _a.sent();
                        return [3 /*break*/, 11];
                    case 10:
                        error_15 = _a.sent();
                        console.error("Failed to measure API call for ".concat(endpoint, ":"), error_15);
                        return [3 /*break*/, 11];
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Create an HTTP metric for network requests
     */
    MonitoringService.prototype.createHttpMetric = function (url, httpMethod) {
        return __awaiter(this, void 0, void 0, function () {
            var error_16;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, perf_1.default)().newHttpMetric(url, httpMethod)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_16 = _a.sent();
                        console.error('Failed to create HTTP metric:', error_16);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Measure data fetch performance
     */
    MonitoringService.prototype.measureDataFetch = function (dataType, startTime, itemCount) {
        return __awaiter(this, void 0, void 0, function () {
            var fetchTime, traceName, trace, error_17;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fetchTime = Date.now() - startTime;
                        traceName = "".concat(PerformanceTrace.DATA_FETCH, "_").concat(dataType);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 8, , 9]);
                        return [4 /*yield*/, (0, perf_1.default)().startTrace(traceName)];
                    case 2:
                        trace = _a.sent();
                        return [4 /*yield*/, trace.putMetric('fetch_time_ms', fetchTime)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, trace.putAttribute('data_type', dataType)];
                    case 4:
                        _a.sent();
                        if (!(itemCount !== undefined)) return [3 /*break*/, 6];
                        return [4 /*yield*/, trace.putMetric('item_count', itemCount)];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [4 /*yield*/, trace.stop()];
                    case 7:
                        _a.sent();
                        return [3 /*break*/, 9];
                    case 8:
                        error_17 = _a.sent();
                        console.error("Failed to measure data fetch for ".concat(dataType, ":"), error_17);
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    // ==================== Utility Methods ====================
    /**
     * Check if monitoring is initialized
     */
    MonitoringService.prototype.isReady = function () {
        return this.isInitialized;
    };
    /**
     * Force crash (for testing only - DO NOT USE IN PRODUCTION)
     */
    MonitoringService.prototype.testCrash = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (__DEV__) {
                    (0, crashlytics_1.default)().crash();
                }
                return [2 /*return*/];
            });
        });
    };
    return MonitoringService;
}());
// Export singleton instance
exports.monitoringService = new MonitoringService();
exports.default = exports.monitoringService;
