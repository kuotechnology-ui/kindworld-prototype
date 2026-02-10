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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfflineStorage = void 0;
var async_storage_1 = __importDefault(require("@react-native-async-storage/async-storage"));
/**
 * Offline storage utility for persisting critical app data
 * Uses AsyncStorage for persistent storage across app sessions
 */
var STORAGE_KEYS = {
    USER_DATA: '@kindworld:user',
    POINTS_HISTORY: '@kindworld:points_history',
    LEADERBOARD: '@kindworld:leaderboard',
    MISSIONS: '@kindworld:missions',
    VOUCHERS: '@kindworld:vouchers',
    REDEMPTIONS: '@kindworld:redemptions',
    LAST_SYNC: '@kindworld:last_sync',
};
var OfflineStorage = /** @class */ (function () {
    function OfflineStorage() {
    }
    /**
     * Save data to offline storage
     */
    OfflineStorage.save = function (key, data) {
        return __awaiter(this, void 0, void 0, function () {
            var jsonData, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        jsonData = JSON.stringify(data);
                        return [4 /*yield*/, async_storage_1.default.setItem(key, jsonData)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.error("Error saving to offline storage (".concat(key, "):"), error_1);
                        throw error_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Load data from offline storage
     */
    OfflineStorage.load = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var jsonData, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, async_storage_1.default.getItem(key)];
                    case 1:
                        jsonData = _a.sent();
                        if (jsonData === null) {
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, JSON.parse(jsonData)];
                    case 2:
                        error_2 = _a.sent();
                        console.error("Error loading from offline storage (".concat(key, "):"), error_2);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Remove data from offline storage
     */
    OfflineStorage.remove = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, async_storage_1.default.removeItem(key)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        console.error("Error removing from offline storage (".concat(key, "):"), error_3);
                        throw error_3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Clear all offline storage
     */
    OfflineStorage.clear = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, async_storage_1.default.clear()];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        console.error('Error clearing offline storage:', error_4);
                        throw error_4;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Save user data
     */
    OfflineStorage.saveUserData = function (userData) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.save(STORAGE_KEYS.USER_DATA, userData)];
            });
        });
    };
    /**
     * Load user data
     */
    OfflineStorage.loadUserData = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.load(STORAGE_KEYS.USER_DATA)];
            });
        });
    };
    /**
     * Save points history
     */
    OfflineStorage.savePointsHistory = function (pointsHistory) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.save(STORAGE_KEYS.POINTS_HISTORY, pointsHistory)];
            });
        });
    };
    /**
     * Load points history
     */
    OfflineStorage.loadPointsHistory = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.load(STORAGE_KEYS.POINTS_HISTORY)];
            });
        });
    };
    /**
     * Save leaderboard data
     */
    OfflineStorage.saveLeaderboard = function (leaderboard) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.save(STORAGE_KEYS.LEADERBOARD, leaderboard)];
            });
        });
    };
    /**
     * Load leaderboard data
     */
    OfflineStorage.loadLeaderboard = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.load(STORAGE_KEYS.LEADERBOARD)];
            });
        });
    };
    /**
     * Save missions data
     */
    OfflineStorage.saveMissions = function (missions) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.save(STORAGE_KEYS.MISSIONS, missions)];
            });
        });
    };
    /**
     * Load missions data
     */
    OfflineStorage.loadMissions = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.load(STORAGE_KEYS.MISSIONS)];
            });
        });
    };
    /**
     * Save vouchers data
     */
    OfflineStorage.saveVouchers = function (vouchers) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.save(STORAGE_KEYS.VOUCHERS, vouchers)];
            });
        });
    };
    /**
     * Load vouchers data
     */
    OfflineStorage.loadVouchers = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.load(STORAGE_KEYS.VOUCHERS)];
            });
        });
    };
    /**
     * Save redemptions data
     */
    OfflineStorage.saveRedemptions = function (redemptions) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.save(STORAGE_KEYS.REDEMPTIONS, redemptions)];
            });
        });
    };
    /**
     * Load redemptions data
     */
    OfflineStorage.loadRedemptions = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.load(STORAGE_KEYS.REDEMPTIONS)];
            });
        });
    };
    /**
     * Save last sync timestamp
     */
    OfflineStorage.saveLastSync = function (timestamp) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.save(STORAGE_KEYS.LAST_SYNC, timestamp)];
            });
        });
    };
    /**
     * Load last sync timestamp
     */
    OfflineStorage.loadLastSync = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.load(STORAGE_KEYS.LAST_SYNC)];
            });
        });
    };
    return OfflineStorage;
}());
exports.OfflineStorage = OfflineStorage;
