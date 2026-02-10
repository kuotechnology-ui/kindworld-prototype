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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectTotalSpent = exports.selectTotalEarned = exports.selectTransactionsByType = exports.selectRecentTransactions = exports.selectLastUpdated = exports.selectPointsError = exports.selectPointsProcessing = exports.selectPointsLoading = exports.selectMonthlyGrowth = exports.selectTransactions = exports.selectCurrentBalance = exports.resetPointsState = exports.setTransactions = exports.setCurrentBalance = exports.clearPointsError = exports.makeAdjustment = exports.awardBonus = exports.awardMissionPoints = exports.fetchTransactionHistory = exports.fetchCurrentBalance = void 0;
var toolkit_1 = require("@reduxjs/toolkit");
var pointsService_1 = require("../../services/pointsService");
var initialState = {
    currentBalance: 0,
    transactions: [],
    isLoading: false,
    isProcessing: false,
    error: null,
    lastUpdated: null,
    monthlyGrowth: 0,
};
/**
 * Fetch user's current points balance
 */
exports.fetchCurrentBalance = (0, toolkit_1.createAsyncThunk)('points/fetchCurrentBalance', function (userId, _a) {
    var rejectWithValue = _a.rejectWithValue;
    return __awaiter(void 0, void 0, void 0, function () {
        var balance, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, pointsService_1.getCurrentBalance)(userId)];
                case 1:
                    balance = _b.sent();
                    return [2 /*return*/, balance];
                case 2:
                    error_1 = _b.sent();
                    return [2 /*return*/, rejectWithValue(error_1.message || 'Failed to fetch balance')];
                case 3: return [2 /*return*/];
            }
        });
    });
});
/**
 * Fetch transaction history for a user
 */
exports.fetchTransactionHistory = (0, toolkit_1.createAsyncThunk)('points/fetchTransactionHistory', function (_a, _b) {
    var userId = _a.userId, _c = _a.limit, limit = _c === void 0 ? 50 : _c;
    var rejectWithValue = _b.rejectWithValue;
    return __awaiter(void 0, void 0, void 0, function () {
        var transactions, error_2;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, pointsService_1.getTransactionHistory)(userId, limit)];
                case 1:
                    transactions = _d.sent();
                    return [2 /*return*/, transactions];
                case 2:
                    error_2 = _d.sent();
                    return [2 /*return*/, rejectWithValue(error_2.message || 'Failed to fetch transaction history')];
                case 3: return [2 /*return*/];
            }
        });
    });
});
/**
 * Award points for mission completion
 */
exports.awardMissionPoints = (0, toolkit_1.createAsyncThunk)('points/awardMissionPoints', function (_a, _b) {
    var userId = _a.userId, missionId = _a.missionId, points = _a.points, description = _a.description;
    var rejectWithValue = _b.rejectWithValue, dispatch = _b.dispatch;
    return __awaiter(void 0, void 0, void 0, function () {
        var transaction, error_3;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, (0, pointsService_1.awardPointsForMission)(userId, missionId, points, description)];
                case 1:
                    transaction = _c.sent();
                    // Refresh balance after awarding points
                    return [4 /*yield*/, dispatch((0, exports.fetchCurrentBalance)(userId))];
                case 2:
                    // Refresh balance after awarding points
                    _c.sent();
                    return [2 /*return*/, transaction];
                case 3:
                    error_3 = _c.sent();
                    return [2 /*return*/, rejectWithValue(error_3.message || 'Failed to award points')];
                case 4: return [2 /*return*/];
            }
        });
    });
});
/**
 * Award bonus points
 */
exports.awardBonus = (0, toolkit_1.createAsyncThunk)('points/awardBonus', function (_a, _b) {
    var userId = _a.userId, points = _a.points, description = _a.description;
    var rejectWithValue = _b.rejectWithValue, dispatch = _b.dispatch;
    return __awaiter(void 0, void 0, void 0, function () {
        var transaction, error_4;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, (0, pointsService_1.awardBonusPoints)(userId, points, description)];
                case 1:
                    transaction = _c.sent();
                    return [4 /*yield*/, dispatch((0, exports.fetchCurrentBalance)(userId))];
                case 2:
                    _c.sent();
                    return [2 /*return*/, transaction];
                case 3:
                    error_4 = _c.sent();
                    return [2 /*return*/, rejectWithValue(error_4.message || 'Failed to award bonus')];
                case 4: return [2 /*return*/];
            }
        });
    });
});
/**
 * Make points adjustment (admin only)
 */
exports.makeAdjustment = (0, toolkit_1.createAsyncThunk)('points/makeAdjustment', function (_a, _b) {
    var userId = _a.userId, points = _a.points, description = _a.description;
    var rejectWithValue = _b.rejectWithValue, dispatch = _b.dispatch;
    return __awaiter(void 0, void 0, void 0, function () {
        var transaction, error_5;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, (0, pointsService_1.adjustPoints)(userId, points, description)];
                case 1:
                    transaction = _c.sent();
                    return [4 /*yield*/, dispatch((0, exports.fetchCurrentBalance)(userId))];
                case 2:
                    _c.sent();
                    return [2 /*return*/, transaction];
                case 3:
                    error_5 = _c.sent();
                    return [2 /*return*/, rejectWithValue(error_5.message || 'Failed to adjust points')];
                case 4: return [2 /*return*/];
            }
        });
    });
});
/**
 * Calculate monthly growth percentage
 */
var calculateMonthlyGrowth = function (transactions) {
    var now = new Date();
    var currentMonth = now.getMonth();
    var currentYear = now.getFullYear();
    var lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    var lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    var currentMonthPoints = 0;
    var lastMonthPoints = 0;
    transactions.forEach(function (transaction) {
        var transactionDate = transaction.timestamp.toDate();
        var transactionMonth = transactionDate.getMonth();
        var transactionYear = transactionDate.getFullYear();
        if (transactionMonth === currentMonth &&
            transactionYear === currentYear &&
            transaction.amount > 0) {
            currentMonthPoints += transaction.amount;
        }
        else if (transactionMonth === lastMonth &&
            transactionYear === lastMonthYear &&
            transaction.amount > 0) {
            lastMonthPoints += transaction.amount;
        }
    });
    if (lastMonthPoints === 0) {
        return currentMonthPoints > 0 ? 100 : 0;
    }
    return ((currentMonthPoints - lastMonthPoints) / lastMonthPoints) * 100;
};
var pointsSlice = (0, toolkit_1.createSlice)({
    name: 'points',
    initialState: initialState,
    reducers: {
        clearPointsError: function (state) {
            state.error = null;
        },
        setCurrentBalance: function (state, action) {
            state.currentBalance = action.payload;
        },
        setTransactions: function (state, action) {
            state.transactions = action.payload;
            state.monthlyGrowth = calculateMonthlyGrowth(action.payload);
        },
        resetPointsState: function () { return initialState; },
    },
    extraReducers: function (builder) {
        // Fetch Current Balance
        builder
            .addCase(exports.fetchCurrentBalance.pending, function (state) {
            state.isLoading = true;
            state.error = null;
        })
            .addCase(exports.fetchCurrentBalance.fulfilled, function (state, action) {
            state.isLoading = false;
            state.currentBalance = action.payload;
            state.lastUpdated = Date.now();
        })
            .addCase(exports.fetchCurrentBalance.rejected, function (state, action) {
            state.isLoading = false;
            state.error = action.payload;
        });
        // Fetch Transaction History
        builder
            .addCase(exports.fetchTransactionHistory.pending, function (state) {
            state.isLoading = true;
            state.error = null;
        })
            .addCase(exports.fetchTransactionHistory.fulfilled, function (state, action) {
            state.isLoading = false;
            state.transactions = action.payload;
            state.monthlyGrowth = calculateMonthlyGrowth(action.payload);
            state.lastUpdated = Date.now();
        })
            .addCase(exports.fetchTransactionHistory.rejected, function (state, action) {
            state.isLoading = false;
            state.error = action.payload;
        });
        // Award Mission Points
        builder
            .addCase(exports.awardMissionPoints.pending, function (state) {
            state.isProcessing = true;
            state.error = null;
        })
            .addCase(exports.awardMissionPoints.fulfilled, function (state, action) {
            state.isProcessing = false;
            state.transactions = __spreadArray([action.payload], state.transactions, true);
            state.monthlyGrowth = calculateMonthlyGrowth(state.transactions);
        })
            .addCase(exports.awardMissionPoints.rejected, function (state, action) {
            state.isProcessing = false;
            state.error = action.payload;
        });
        // Award Bonus
        builder
            .addCase(exports.awardBonus.pending, function (state) {
            state.isProcessing = true;
            state.error = null;
        })
            .addCase(exports.awardBonus.fulfilled, function (state, action) {
            state.isProcessing = false;
            state.transactions = __spreadArray([action.payload], state.transactions, true);
            state.monthlyGrowth = calculateMonthlyGrowth(state.transactions);
        })
            .addCase(exports.awardBonus.rejected, function (state, action) {
            state.isProcessing = false;
            state.error = action.payload;
        });
        // Make Adjustment
        builder
            .addCase(exports.makeAdjustment.pending, function (state) {
            state.isProcessing = true;
            state.error = null;
        })
            .addCase(exports.makeAdjustment.fulfilled, function (state, action) {
            state.isProcessing = false;
            state.transactions = __spreadArray([action.payload], state.transactions, true);
            state.monthlyGrowth = calculateMonthlyGrowth(state.transactions);
        })
            .addCase(exports.makeAdjustment.rejected, function (state, action) {
            state.isProcessing = false;
            state.error = action.payload;
        });
    },
});
exports.clearPointsError = (_a = pointsSlice.actions, _a.clearPointsError), exports.setCurrentBalance = _a.setCurrentBalance, exports.setTransactions = _a.setTransactions, exports.resetPointsState = _a.resetPointsState;
// Selectors
var selectCurrentBalance = function (state) {
    return state.points.currentBalance;
};
exports.selectCurrentBalance = selectCurrentBalance;
var selectTransactions = function (state) {
    return state.points.transactions;
};
exports.selectTransactions = selectTransactions;
var selectMonthlyGrowth = function (state) {
    return state.points.monthlyGrowth;
};
exports.selectMonthlyGrowth = selectMonthlyGrowth;
var selectPointsLoading = function (state) {
    return state.points.isLoading;
};
exports.selectPointsLoading = selectPointsLoading;
var selectPointsProcessing = function (state) {
    return state.points.isProcessing;
};
exports.selectPointsProcessing = selectPointsProcessing;
var selectPointsError = function (state) { return state.points.error; };
exports.selectPointsError = selectPointsError;
var selectLastUpdated = function (state) {
    return state.points.lastUpdated;
};
exports.selectLastUpdated = selectLastUpdated;
// Derived selectors
var selectRecentTransactions = function (state, limit) {
    if (limit === void 0) { limit = 10; }
    return state.points.transactions.slice(0, limit);
};
exports.selectRecentTransactions = selectRecentTransactions;
var selectTransactionsByType = function (state, type) { return state.points.transactions.filter(function (t) { return t.type === type; }); };
exports.selectTransactionsByType = selectTransactionsByType;
var selectTotalEarned = function (state) {
    return state.points.transactions
        .filter(function (t) { return t.amount > 0; })
        .reduce(function (sum, t) { return sum + t.amount; }, 0);
};
exports.selectTotalEarned = selectTotalEarned;
var selectTotalSpent = function (state) {
    return Math.abs(state.points.transactions
        .filter(function (t) { return t.amount < 0; })
        .reduce(function (sum, t) { return sum + t.amount; }, 0));
};
exports.selectTotalSpent = selectTotalSpent;
exports.default = pointsSlice.reducer;
