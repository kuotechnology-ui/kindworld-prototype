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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncManager = void 0;
var store_1 = require("../store");
var offlineStorage_1 = require("./offlineStorage");
/**
 * Sync Manager for handling data synchronization when coming back online
 */
var SyncManager = exports.SyncManager = /** @class */ (function () {
    function SyncManager() {
    }
    /**
     * Sync all data when coming back online
     */
    SyncManager.syncAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            var state, lastSync, now, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.isSyncing) {
                            console.log('Sync already in progress');
                            return [2 /*return*/];
                        }
                        this.isSyncing = true;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, 7, 8]);
                        console.log('Starting data synchronization...');
                        state = store_1.store.getState();
                        return [4 /*yield*/, offlineStorage_1.OfflineStorage.loadLastSync()];
                    case 2:
                        lastSync = _a.sent();
                        now = Date.now();
                        // Only sync if last sync was more than 5 minutes ago
                        if (lastSync && now - lastSync < 5 * 60 * 1000) {
                            console.log('Data is recent, skipping sync');
                            this.isSyncing = false;
                            return [2 /*return*/];
                        }
                        // Process sync queue
                        return [4 /*yield*/, this.processSyncQueue()];
                    case 3:
                        // Process sync queue
                        _a.sent();
                        // Refresh critical data from server
                        return [4 /*yield*/, this.refreshData()];
                    case 4:
                        // Refresh critical data from server
                        _a.sent();
                        // Update last sync timestamp
                        return [4 /*yield*/, offlineStorage_1.OfflineStorage.saveLastSync(now)];
                    case 5:
                        // Update last sync timestamp
                        _a.sent();
                        console.log('Data synchronization completed');
                        return [3 /*break*/, 8];
                    case 6:
                        error_1 = _a.sent();
                        console.error('Error during synchronization:', error_1);
                        return [3 /*break*/, 8];
                    case 7:
                        this.isSyncing = false;
                        return [7 /*endfinally*/];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Add a sync task to the queue
     */
    SyncManager.addToSyncQueue = function (task) {
        this.syncQueue.push(task);
    };
    /**
     * Process all queued sync tasks
     */
    SyncManager.processSyncQueue = function () {
        return __awaiter(this, void 0, void 0, function () {
            var task, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.syncQueue.length > 0)) return [3 /*break*/, 5];
                        task = this.syncQueue.shift();
                        if (!task) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, task()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        console.error('Error processing sync task:', error_2);
                        return [3 /*break*/, 4];
                    case 4: return [3 /*break*/, 0];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Refresh data from server
     */
    SyncManager.refreshData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var state;
            return __generator(this, function (_a) {
                state = store_1.store.getState();
                // Dispatch refresh actions for critical data
                // Note: These would be actual thunks in production
                try {
                    // Refresh user data
                    if (state.auth.user) {
                        // store.dispatch(refreshUserData());
                    }
                    // Refresh dashboard data
                    // store.dispatch(refreshDashboard());
                    // Refresh missions
                    // store.dispatch(refreshMissions());
                    // Refresh vouchers
                    // store.dispatch(refreshVouchers());
                }
                catch (error) {
                    console.error('Error refreshing data:', error);
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Check if sync is needed
     */
    SyncManager.needsSync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var lastSync, now, fiveMinutes;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, offlineStorage_1.OfflineStorage.loadLastSync()];
                    case 1:
                        lastSync = _a.sent();
                        if (!lastSync)
                            return [2 /*return*/, true];
                        now = Date.now();
                        fiveMinutes = 5 * 60 * 1000;
                        return [2 /*return*/, now - lastSync > fiveMinutes];
                }
            });
        });
    };
    /**
     * Clear sync queue
     */
    SyncManager.clearSyncQueue = function () {
        this.syncQueue = [];
    };
    SyncManager.isSyncing = false;
    SyncManager.syncQueue = [];
    return SyncManager;
}());
