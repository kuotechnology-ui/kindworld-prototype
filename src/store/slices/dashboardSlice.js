"use strict";
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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectLastUpdated = exports.selectDashboardError = exports.selectDashboardRefreshing = exports.selectDashboardLoading = exports.selectLeaderboard = exports.selectPointsHistory = exports.setLeaderboard = exports.setPointsHistory = exports.clearDashboardError = exports.refreshDashboard = exports.fetchLeaderboard = exports.fetchPointsHistory = void 0;
var toolkit_1 = require("@reduxjs/toolkit");
var firestore_1 = __importDefault(require("@react-native-firebase/firestore"));
var initialState = {
    pointsHistory: [],
    leaderboard: [],
    isLoading: false,
    isRefreshing: false,
    error: null,
    lastUpdated: null,
};
// Async thunk to fetch points history
exports.fetchPointsHistory = (0, toolkit_1.createAsyncThunk)('dashboard/fetchPointsHistory', function (userId, _a) {
    var rejectWithValue = _a.rejectWithValue;
    return __awaiter(void 0, void 0, void 0, function () {
        var thirtyDaysAgo, snapshot, pointsByDate_1, runningTotal_1, history_1, today, i, date, dateStr, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    thirtyDaysAgo = new Date();
                    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                    return [4 /*yield*/, (0, firestore_1.default)()
                            .collection('pointsTransactions')
                            .where('userId', '==', userId)
                            .where('timestamp', '>=', firestore_1.default.Timestamp.fromDate(thirtyDaysAgo))
                            .orderBy('timestamp', 'asc')
                            .get()];
                case 1:
                    snapshot = _b.sent();
                    pointsByDate_1 = {};
                    runningTotal_1 = 0;
                    snapshot.forEach(function (doc) {
                        var data = doc.data();
                        var date = data.timestamp.toDate();
                        var dateStr = "".concat(date.getMonth() + 1, "/").concat(date.getDate());
                        runningTotal_1 += data.amount;
                        pointsByDate_1[dateStr] = runningTotal_1;
                    });
                    history_1 = Object.entries(pointsByDate_1).map(function (_a) {
                        var date = _a[0], points = _a[1];
                        return ({
                            date: date,
                            points: points,
                        });
                    });
                    // If no data, generate placeholder
                    if (history_1.length === 0) {
                        today = new Date();
                        for (i = 29; i >= 0; i--) {
                            date = new Date(today);
                            date.setDate(date.getDate() - i);
                            dateStr = "".concat(date.getMonth() + 1, "/").concat(date.getDate());
                            history_1.push({ date: dateStr, points: 0 });
                        }
                    }
                    return [2 /*return*/, history_1];
                case 2:
                    error_1 = _b.sent();
                    return [2 /*return*/, rejectWithValue(error_1.message || 'Failed to fetch points history')];
                case 3: return [2 /*return*/];
            }
        });
    });
});
// Async thunk to fetch leaderboard
exports.fetchLeaderboard = (0, toolkit_1.createAsyncThunk)('dashboard/fetchLeaderboard', function (_, _a) {
    var rejectWithValue = _a.rejectWithValue;
    return __awaiter(void 0, void 0, void 0, function () {
        var snapshot, leaderboard_1, error_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, firestore_1.default)()
                            .collection('users')
                            // Prefer the new field 'volunteerHours' but keep compatibility if older docs still have compassionPoints
                            .orderBy('volunteerHours', 'desc')
                            .limit(50)
                            .get()];
                case 1:
                    snapshot = _b.sent();
                    leaderboard_1 = [];
                    snapshot.forEach(function (doc, index) {
                        var data = doc.data();
                        var hours = data.volunteerHours !== undefined ? data.volunteerHours : (data.compassionPoints || 0);
                        leaderboard_1.push({
                            userId: doc.id,
                            displayName: data.displayName || 'Anonymous',
                            photoURL: data.photoURL,
                            volunteerHours: hours,
                            rank: index + 1,
                            change: 0, // TODO: Calculate from previous period
                        });
                    });
                    return [2 /*return*/, leaderboard_1];
                case 2:
                    error_2 = _b.sent();
                    return [2 /*return*/, rejectWithValue(error_2.message || 'Failed to fetch leaderboard')];
                case 3: return [2 /*return*/];
            }
        });
    });
});
// Async thunk to refresh all dashboard data
exports.refreshDashboard = (0, toolkit_1.createAsyncThunk)('dashboard/refresh', function (userId, _a) {
    var dispatch = _a.dispatch;
    return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, Promise.all([
                        dispatch((0, exports.fetchPointsHistory)(userId)),
                        dispatch((0, exports.fetchLeaderboard)()),
                    ])];
                case 1:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
});
var dashboardSlice = (0, toolkit_1.createSlice)({
    name: 'dashboard',
    initialState: initialState,
    reducers: {
        clearDashboardError: function (state) {
            state.error = null;
        },
        setPointsHistory: function (state, action) {
            state.pointsHistory = action.payload;
        },
        setLeaderboard: function (state, action) {
            state.leaderboard = action.payload;
        },
    },
    extraReducers: function (builder) {
        // Fetch Points History
        builder
            .addCase(exports.fetchPointsHistory.pending, function (state) {
            state.isLoading = true;
            state.error = null;
        })
            .addCase(exports.fetchPointsHistory.fulfilled, function (state, action) {
            state.isLoading = false;
            state.pointsHistory = action.payload;
            state.lastUpdated = Date.now();
        })
            .addCase(exports.fetchPointsHistory.rejected, function (state, action) {
            state.isLoading = false;
            state.error = action.payload;
        });
        // Fetch Leaderboard
        builder
            .addCase(exports.fetchLeaderboard.pending, function (state) {
            state.isLoading = true;
            state.error = null;
        })
            .addCase(exports.fetchLeaderboard.fulfilled, function (state, action) {
            state.isLoading = false;
            state.leaderboard = action.payload;
            state.lastUpdated = Date.now();
        })
            .addCase(exports.fetchLeaderboard.rejected, function (state, action) {
            state.isLoading = false;
            state.error = action.payload;
        });
        // Refresh Dashboard
        builder
            .addCase(exports.refreshDashboard.pending, function (state) {
            state.isRefreshing = true;
            state.error = null;
        })
            .addCase(exports.refreshDashboard.fulfilled, function (state) {
            state.isRefreshing = false;
            state.lastUpdated = Date.now();
        })
            .addCase(exports.refreshDashboard.rejected, function (state, action) {
            state.isRefreshing = false;
            state.error = action.error.message || 'Failed to refresh dashboard';
        });
    },
});
exports.clearDashboardError = (_a = dashboardSlice.actions, _a.clearDashboardError), exports.setPointsHistory = _a.setPointsHistory, exports.setLeaderboard = _a.setLeaderboard;
// Selectors
var selectPointsHistory = function (state) {
    return state.dashboard.pointsHistory;
};
exports.selectPointsHistory = selectPointsHistory;
var selectLeaderboard = function (state) {
    return state.dashboard.leaderboard;
};
exports.selectLeaderboard = selectLeaderboard;
var selectDashboardLoading = function (state) {
    return state.dashboard.isLoading;
};
exports.selectDashboardLoading = selectDashboardLoading;
var selectDashboardRefreshing = function (state) {
    return state.dashboard.isRefreshing;
};
exports.selectDashboardRefreshing = selectDashboardRefreshing;
var selectDashboardError = function (state) { return state.dashboard.error; };
exports.selectDashboardError = selectDashboardError;
var selectLastUpdated = function (state) {
    return state.dashboard.lastUpdated;
};
exports.selectLastUpdated = selectLastUpdated;
exports.default = dashboardSlice.reducer;
