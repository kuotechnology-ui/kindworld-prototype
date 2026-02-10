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
Object.defineProperty(exports, "__esModule", { value: true });
exports.adjustPoints = exports.awardBonusPoints = exports.getCurrentBalance = exports.getTransactionHistory = exports.awardPointsForMission = void 0;
var firebase_1 = require("./firebase");
/**
 * Points Service Layer
 * Handles all points-related operations including awarding, deducting, and tracking transactions
 */
var COLLECTIONS = {
    USERS: 'users',
    TRANSACTIONS: 'pointsTransactions',
};
/**
 * Award points to a user for mission completion
 * @param userId - The user's ID
 * @param missionId - The mission ID
 * @param points - Number of points to award
 * @param description - Description of the transaction
 * @returns The created transaction
 */
var awardPointsForMission = function (userId, missionId, points, description) { return __awaiter(void 0, void 0, void 0, function () {
    var batch, userRef, transactionRef, transaction;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (points <= 0) {
                    throw new Error('Points must be greater than 0');
                }
                batch = (0, firebase_1.firebaseFirestore)().batch();
                userRef = (0, firebase_1.firebaseFirestore)().collection(COLLECTIONS.USERS).doc(userId);
                transactionRef = (0, firebase_1.firebaseFirestore)()
                    .collection(COLLECTIONS.TRANSACTIONS)
                    .doc();
                transaction = {
                    userId: userId,
                    amount: points,
                    type: 'mission_completion',
                    relatedId: missionId,
                    description: description,
                    timestamp: firebase_1.firebaseFirestore.Timestamp.now(),
                };
                batch.set(transactionRef, transaction);
                // Update user's volunteer hours and keep compassionPoints in sync for backward compatibility
                batch.update(userRef, {
                    volunteerHours: firebase_1.firebaseFirestore.FieldValue.increment(points),
                    compassionPoints: firebase_1.firebaseFirestore.FieldValue.increment(points),
                    updatedAt: firebase_1.firebaseFirestore.Timestamp.now(),
                });
                return [4 /*yield*/, batch.commit()];
            case 1:
                _a.sent();
                return [2 /*return*/, __assign({ id: transactionRef.id }, transaction)];
        }
    });
}); };
exports.awardPointsForMission = awardPointsForMission;
/**
 * Get transaction history for a user
 * @param userId - The user's ID
 * @param limit - Maximum number of transactions to retrieve (default: 50)
 * @returns Array of transactions
 */
var getTransactionHistory = function (userId, limit) {
    if (limit === void 0) { limit = 50; }
    return __awaiter(void 0, void 0, void 0, function () {
        var snapshot;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, firebase_1.firebaseFirestore)()
                        .collection(COLLECTIONS.TRANSACTIONS)
                        .where('userId', '==', userId)
                        .orderBy('timestamp', 'desc')
                        .limit(limit)
                        .get()];
                case 1:
                    snapshot = _a.sent();
                    return [2 /*return*/, snapshot.docs.map(function (doc) { return (__assign({ id: doc.id }, doc.data())); })];
            }
        });
    });
};
exports.getTransactionHistory = getTransactionHistory;
/**
 * Get user's current points balance
 * @param userId - The user's ID
 * @returns Current points balance
 */
var getCurrentBalance = function (userId) { return __awaiter(void 0, void 0, void 0, function () {
    var userDoc;
    var _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0: return [4 /*yield*/, (0, firebase_1.firebaseFirestore)()
                    .collection(COLLECTIONS.USERS)
                    .doc(userId)
                    .get()];
            case 1:
                userDoc = _d.sent();
                if (!userDoc.exists) {
                    throw new Error('User not found');
                }
                return [2 /*return*/, (_b = (_a = userDoc.data()) === null || _a === void 0 ? void 0 : _a.volunteerHours) !== null && _b !== void 0 ? _b : ((_c = userDoc.data()) === null || _c === void 0 ? void 0 : _c.compassionPoints) || 0];
        }
    });
}); };
exports.getCurrentBalance = getCurrentBalance;
/**
 * Award bonus points to a user
 * @param userId - The user's ID
 * @param points - Number of points to award
 * @param description - Description of the bonus
 * @returns The created transaction
 */
var awardBonusPoints = function (userId, points, description) { return __awaiter(void 0, void 0, void 0, function () {
    var batch, userRef, transactionRef, transaction;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (points <= 0) {
                    throw new Error('Points must be greater than 0');
                }
                batch = (0, firebase_1.firebaseFirestore)().batch();
                userRef = (0, firebase_1.firebaseFirestore)().collection(COLLECTIONS.USERS).doc(userId);
                transactionRef = (0, firebase_1.firebaseFirestore)()
                    .collection(COLLECTIONS.TRANSACTIONS)
                    .doc();
                transaction = {
                    userId: userId,
                    amount: points,
                    type: 'bonus',
                    description: description,
                    timestamp: firebase_1.firebaseFirestore.Timestamp.now(),
                };
                batch.set(transactionRef, transaction);
                batch.update(userRef, {
                    volunteerHours: firebase_1.firebaseFirestore.FieldValue.increment(points),
                    compassionPoints: firebase_1.firebaseFirestore.FieldValue.increment(points),
                    updatedAt: firebase_1.firebaseFirestore.Timestamp.now(),
                });
                return [4 /*yield*/, batch.commit()];
            case 1:
                _a.sent();
                return [2 /*return*/, __assign({ id: transactionRef.id }, transaction)];
        }
    });
}); };
exports.awardBonusPoints = awardBonusPoints;
/**
 * Make a points adjustment (admin only)
 * @param userId - The user's ID
 * @param points - Number of points to adjust (positive or negative)
 * @param description - Description of the adjustment
 * @returns The created transaction
 */
var adjustPoints = function (userId, points, description) { return __awaiter(void 0, void 0, void 0, function () {
    var batch, userRef, transactionRef, transaction;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (points === 0) {
                    throw new Error('Adjustment amount cannot be zero');
                }
                batch = (0, firebase_1.firebaseFirestore)().batch();
                userRef = (0, firebase_1.firebaseFirestore)().collection(COLLECTIONS.USERS).doc(userId);
                transactionRef = (0, firebase_1.firebaseFirestore)()
                    .collection(COLLECTIONS.TRANSACTIONS)
                    .doc();
                transaction = {
                    userId: userId,
                    amount: points,
                    type: 'adjustment',
                    description: description,
                    timestamp: firebase_1.firebaseFirestore.Timestamp.now(),
                };
                batch.set(transactionRef, transaction);
                batch.update(userRef, {
                    volunteerHours: firebase_1.firebaseFirestore.FieldValue.increment(points),
                    compassionPoints: firebase_1.firebaseFirestore.FieldValue.increment(points),
                    updatedAt: firebase_1.firebaseFirestore.Timestamp.now(),
                });
                return [4 /*yield*/, batch.commit()];
            case 1:
                _a.sent();
                return [2 /*return*/, __assign({ id: transactionRef.id }, transaction)];
        }
    });
}); };
exports.adjustPoints = adjustPoints;
exports.default = {
    awardPointsForMission: exports.awardPointsForMission,
    getTransactionHistory: exports.getTransactionHistory,
    getCurrentBalance: exports.getCurrentBalance,
    awardBonusPoints: exports.awardBonusPoints,
    adjustPoints: exports.adjustPoints,
};
