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
exports.isFriend = exports.removeFriend = exports.cancelFriendRequest = exports.rejectFriendRequest = exports.acceptFriendRequest = exports.getIncomingRequests = exports.getFriendRequestBetween = exports.sendFriendRequest = void 0;
var firebase_1 = require("./firebase");
var COLLECTIONS = {
    FRIEND_REQUESTS: 'friendRequests',
    USERS: 'users',
};
var sendFriendRequest = function (fromUserId, toUserId) { return __awaiter(void 0, void 0, void 0, function () {
    var docRef, payload;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (fromUserId === toUserId)
                    throw new Error('Cannot send request to self');
                docRef = (0, firebase_1.firebaseFirestore)().collection(COLLECTIONS.FRIEND_REQUESTS).doc();
                payload = {
                    fromUserId: fromUserId,
                    toUserId: toUserId,
                    status: 'pending',
                    createdAt: firebase_1.firebaseFirestore.Timestamp.now(),
                };
                return [4 /*yield*/, docRef.set(payload)];
            case 1:
                _a.sent();
                return [2 /*return*/, __assign({ id: docRef.id }, payload)];
        }
    });
}); };
exports.sendFriendRequest = sendFriendRequest;
var getFriendRequestBetween = function (userA, userB) { return __awaiter(void 0, void 0, void 0, function () {
    var outSnap, doc, inSnap, doc;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, firebase_1.firebaseFirestore)()
                    .collection(COLLECTIONS.FRIEND_REQUESTS)
                    .where('fromUserId', '==', userA)
                    .where('toUserId', '==', userB)
                    .get()];
            case 1:
                outSnap = _a.sent();
                if (!outSnap.empty) {
                    doc = outSnap.docs[0];
                    return [2 /*return*/, __assign({ id: doc.id }, doc.data())];
                }
                return [4 /*yield*/, (0, firebase_1.firebaseFirestore)()
                        .collection(COLLECTIONS.FRIEND_REQUESTS)
                        .where('fromUserId', '==', userB)
                        .where('toUserId', '==', userA)
                        .get()];
            case 2:
                inSnap = _a.sent();
                if (!inSnap.empty) {
                    doc = inSnap.docs[0];
                    return [2 /*return*/, __assign({ id: doc.id }, doc.data())];
                }
                return [2 /*return*/, null];
        }
    });
}); };
exports.getFriendRequestBetween = getFriendRequestBetween;
var getIncomingRequests = function (userId) { return __awaiter(void 0, void 0, void 0, function () {
    var snapshot;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, firebase_1.firebaseFirestore)()
                    .collection(COLLECTIONS.FRIEND_REQUESTS)
                    .where('toUserId', '==', userId)
                    .where('status', '==', 'pending')
                    .orderBy('createdAt', 'desc')
                    .get()];
            case 1:
                snapshot = _a.sent();
                return [2 /*return*/, snapshot.docs.map(function (d) { return (__assign({ id: d.id }, d.data())); })];
        }
    });
}); };
exports.getIncomingRequests = getIncomingRequests;
var acceptFriendRequest = function (requestId) { return __awaiter(void 0, void 0, void 0, function () {
    var reqRef, reqDoc, req, batch, userRef, otherRef;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                reqRef = (0, firebase_1.firebaseFirestore)().collection(COLLECTIONS.FRIEND_REQUESTS).doc(requestId);
                return [4 /*yield*/, reqRef.get()];
            case 1:
                reqDoc = _a.sent();
                if (!reqDoc.exists)
                    throw new Error('Request not found');
                req = reqDoc.data();
                if (req.status !== 'pending')
                    throw new Error('Request not pending');
                batch = (0, firebase_1.firebaseFirestore)().batch();
                // Update request status
                batch.update(reqRef, { status: 'accepted', updatedAt: firebase_1.firebaseFirestore.Timestamp.now() });
                userRef = (0, firebase_1.firebaseFirestore)().collection(COLLECTIONS.USERS).doc(req.fromUserId);
                otherRef = (0, firebase_1.firebaseFirestore)().collection(COLLECTIONS.USERS).doc(req.toUserId);
                batch.update(userRef, { friends: firebase_1.firebaseFirestore.FieldValue.arrayUnion(req.toUserId) });
                batch.update(otherRef, { friends: firebase_1.firebaseFirestore.FieldValue.arrayUnion(req.fromUserId) });
                return [4 /*yield*/, batch.commit()];
            case 2:
                _a.sent();
                return [2 /*return*/, true];
        }
    });
}); };
exports.acceptFriendRequest = acceptFriendRequest;
var rejectFriendRequest = function (requestId) { return __awaiter(void 0, void 0, void 0, function () {
    var reqRef, reqDoc;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                reqRef = (0, firebase_1.firebaseFirestore)().collection(COLLECTIONS.FRIEND_REQUESTS).doc(requestId);
                return [4 /*yield*/, reqRef.get()];
            case 1:
                reqDoc = _a.sent();
                if (!reqDoc.exists)
                    throw new Error('Request not found');
                return [4 /*yield*/, reqRef.update({ status: 'rejected', updatedAt: firebase_1.firebaseFirestore.Timestamp.now() })];
            case 2:
                _a.sent();
                return [2 /*return*/, true];
        }
    });
}); };
exports.rejectFriendRequest = rejectFriendRequest;
var cancelFriendRequest = function (requestId) { return __awaiter(void 0, void 0, void 0, function () {
    var reqRef, reqDoc, req;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                reqRef = (0, firebase_1.firebaseFirestore)().collection(COLLECTIONS.FRIEND_REQUESTS).doc(requestId);
                return [4 /*yield*/, reqRef.get()];
            case 1:
                reqDoc = _a.sent();
                if (!reqDoc.exists)
                    throw new Error('Request not found');
                req = reqDoc.data();
                if (req.status !== 'pending')
                    throw new Error('Only pending requests can be canceled');
                return [4 /*yield*/, reqRef.delete()];
            case 2:
                _a.sent();
                return [2 /*return*/, true];
        }
    });
}); };
exports.cancelFriendRequest = cancelFriendRequest;
var removeFriend = function (userId, friendId) { return __awaiter(void 0, void 0, void 0, function () {
    var batch, userRef, friendRef;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                batch = (0, firebase_1.firebaseFirestore)().batch();
                userRef = (0, firebase_1.firebaseFirestore)().collection(COLLECTIONS.USERS).doc(userId);
                friendRef = (0, firebase_1.firebaseFirestore)().collection(COLLECTIONS.USERS).doc(friendId);
                batch.update(userRef, { friends: firebase_1.firebaseFirestore.FieldValue.arrayRemove(friendId) });
                batch.update(friendRef, { friends: firebase_1.firebaseFirestore.FieldValue.arrayRemove(userId) });
                return [4 /*yield*/, batch.commit()];
            case 1:
                _a.sent();
                return [2 /*return*/, true];
        }
    });
}); };
exports.removeFriend = removeFriend;
var isFriend = function (userId, otherId) { return __awaiter(void 0, void 0, void 0, function () {
    var doc, data, friends;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, firebase_1.firebaseFirestore)().collection(COLLECTIONS.USERS).doc(userId).get()];
            case 1:
                doc = _a.sent();
                data = doc.data();
                if (!data)
                    return [2 /*return*/, false];
                friends = data.friends || [];
                return [2 /*return*/, friends.includes(otherId)];
        }
    });
}); };
exports.isFriend = isFriend;
exports.default = {
    sendFriendRequest: exports.sendFriendRequest,
    getFriendRequestBetween: exports.getFriendRequestBetween,
    getIncomingRequests: exports.getIncomingRequests,
    acceptFriendRequest: exports.acceptFriendRequest,
    rejectFriendRequest: exports.rejectFriendRequest,
    cancelFriendRequest: exports.cancelFriendRequest,
    removeFriend: exports.removeFriend,
    isFriend: exports.isFriend,
};
