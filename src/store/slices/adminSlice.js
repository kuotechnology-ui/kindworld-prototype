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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetUploadProgress = exports.setUploadProgress = exports.clearError = exports.setSelectedMission = exports.bulkDeleteMissions = exports.bulkUpdateMissionStatus = exports.fetchMissionAnalytics = exports.fetchMissionParticipants = exports.updateMissionStatus = exports.deleteMission = exports.updateMission = exports.createMission = exports.fetchAllMissions = void 0;
var toolkit_1 = require("@reduxjs/toolkit");
var firestore_1 = __importDefault(require("@react-native-firebase/firestore"));
var storage_1 = __importDefault(require("@react-native-firebase/storage"));
var initialState = {
    missions: [],
    selectedMission: null,
    participants: {},
    analytics: {},
    loading: false,
    error: null,
    uploadProgress: 0,
};
// Fetch all missions (admin view - includes all statuses)
exports.fetchAllMissions = (0, toolkit_1.createAsyncThunk)('admin/fetchAllMissions', function (_, _a) {
    var getState = _a.getState;
    return __awaiter(void 0, void 0, void 0, function () {
        var state, userId, snapshot, missions;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    state = getState();
                    userId = (_b = state.auth.user) === null || _b === void 0 ? void 0 : _b.id;
                    if (!userId) {
                        throw new Error('User not authenticated');
                    }
                    return [4 /*yield*/, (0, firestore_1.default)()
                            .collection('missions')
                            .where('createdBy', '==', userId)
                            .orderBy('createdAt', 'desc')
                            .get()];
                case 1:
                    snapshot = _c.sent();
                    missions = snapshot.docs.map(function (doc) { return (__assign({ id: doc.id }, doc.data())); });
                    return [2 /*return*/, missions];
            }
        });
    });
});
// Upload images to Firebase Storage
var uploadImages = function (imageUris, missionId, onProgress) { return __awaiter(void 0, void 0, void 0, function () {
    var uploadPromises;
    return __generator(this, function (_a) {
        uploadPromises = imageUris.map(function (uri, index) { return __awaiter(void 0, void 0, void 0, function () {
            var filename, reference, task;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        filename = "missions/".concat(missionId, "/").concat(Date.now(), "_").concat(index, ".jpg");
                        reference = (0, storage_1.default)().ref(filename);
                        task = reference.putFile(uri);
                        if (onProgress) {
                            task.on('state_changed', function (snapshot) {
                                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                                onProgress(progress / imageUris.length + (index / imageUris.length) * 100);
                            });
                        }
                        return [4 /*yield*/, task];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, reference.getDownloadURL()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        }); });
        return [2 /*return*/, Promise.all(uploadPromises)];
    });
}); };
// Create a new mission
exports.createMission = (0, toolkit_1.createAsyncThunk)('admin/createMission', function (missionInput, _a) {
    var getState = _a.getState, dispatch = _a.dispatch;
    return __awaiter(void 0, void 0, void 0, function () {
        var state, userId, missionRef, missionId, imageUrls, missionData;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    state = getState();
                    userId = (_b = state.auth.user) === null || _b === void 0 ? void 0 : _b.id;
                    if (!userId) {
                        throw new Error('User not authenticated');
                    }
                    missionRef = (0, firestore_1.default)().collection('missions').doc();
                    missionId = missionRef.id;
                    imageUrls = [];
                    if (!(missionInput.imageUris && missionInput.imageUris.length > 0)) return [3 /*break*/, 2];
                    return [4 /*yield*/, uploadImages(missionInput.imageUris, missionId, function (progress) {
                            dispatch((0, exports.setUploadProgress)(progress));
                        })];
                case 1:
                    imageUrls = _c.sent();
                    _c.label = 2;
                case 2:
                    missionData = {
                        title: missionInput.title,
                        description: missionInput.description,
                        imageUrls: imageUrls,
                        date: firestore_1.default.Timestamp.fromDate(missionInput.date),
                        location: {
                            address: missionInput.location.address,
                            city: missionInput.location.city,
                            coordinates: new firestore_1.default.GeoPoint(missionInput.location.latitude, missionInput.location.longitude),
                        },
                        pointsReward: missionInput.pointsReward,
                        category: missionInput.category,
                        sponsorId: missionInput.sponsorId || null,
                        maxParticipants: missionInput.maxParticipants || null,
                        currentParticipants: 0,
                        status: 'draft',
                        createdBy: userId,
                        createdAt: firestore_1.default.FieldValue.serverTimestamp(),
                        updatedAt: firestore_1.default.FieldValue.serverTimestamp(),
                    };
                    return [4 /*yield*/, missionRef.set(missionData)];
                case 3:
                    _c.sent();
                    return [2 /*return*/, __assign(__assign({ id: missionId }, missionData), { createdAt: firestore_1.default.Timestamp.now(), updatedAt: firestore_1.default.Timestamp.now() })];
            }
        });
    });
});
// Update an existing mission
exports.updateMission = (0, toolkit_1.createAsyncThunk)('admin/updateMission', function (_a, _b) {
    var missionId = _a.missionId, updates = _a.updates;
    var getState = _b.getState, dispatch = _b.dispatch;
    return __awaiter(void 0, void 0, void 0, function () {
        var state, userId, missionRef, missionDoc, missionData, imageUrls, newImageUrls, updateData, updatedDoc;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    state = getState();
                    userId = (_c = state.auth.user) === null || _c === void 0 ? void 0 : _c.id;
                    if (!userId) {
                        throw new Error('User not authenticated');
                    }
                    missionRef = (0, firestore_1.default)().collection('missions').doc(missionId);
                    return [4 /*yield*/, missionRef.get()];
                case 1:
                    missionDoc = _d.sent();
                    if (!missionDoc.exists) {
                        throw new Error('Mission not found');
                    }
                    missionData = missionDoc.data();
                    if ((missionData === null || missionData === void 0 ? void 0 : missionData.createdBy) !== userId) {
                        throw new Error('Unauthorized to update this mission');
                    }
                    imageUrls = (missionData === null || missionData === void 0 ? void 0 : missionData.imageUrls) || [];
                    if (!(updates.imageUris && updates.imageUris.length > 0)) return [3 /*break*/, 3];
                    return [4 /*yield*/, uploadImages(updates.imageUris, missionId, function (progress) {
                            dispatch((0, exports.setUploadProgress)(progress));
                        })];
                case 2:
                    newImageUrls = _d.sent();
                    imageUrls = __spreadArray(__spreadArray([], imageUrls, true), newImageUrls, true);
                    _d.label = 3;
                case 3:
                    updateData = {
                        updatedAt: firestore_1.default.FieldValue.serverTimestamp(),
                    };
                    if (updates.title)
                        updateData.title = updates.title;
                    if (updates.description)
                        updateData.description = updates.description;
                    if (updates.date)
                        updateData.date = firestore_1.default.Timestamp.fromDate(updates.date);
                    if (updates.location) {
                        updateData.location = {
                            address: updates.location.address,
                            city: updates.location.city,
                            coordinates: new firestore_1.default.GeoPoint(updates.location.latitude, updates.location.longitude),
                        };
                    }
                    if (updates.pointsReward !== undefined)
                        updateData.pointsReward = updates.pointsReward;
                    if (updates.category)
                        updateData.category = updates.category;
                    if (updates.maxParticipants !== undefined)
                        updateData.maxParticipants = updates.maxParticipants;
                    if (updates.sponsorId !== undefined)
                        updateData.sponsorId = updates.sponsorId;
                    if (imageUrls.length > 0)
                        updateData.imageUrls = imageUrls;
                    return [4 /*yield*/, missionRef.update(updateData)];
                case 4:
                    _d.sent();
                    return [4 /*yield*/, missionRef.get()];
                case 5:
                    updatedDoc = _d.sent();
                    return [2 /*return*/, __assign({ id: missionId }, updatedDoc.data())];
            }
        });
    });
});
// Delete a mission
exports.deleteMission = (0, toolkit_1.createAsyncThunk)('admin/deleteMission', function (missionId, _a) {
    var getState = _a.getState;
    return __awaiter(void 0, void 0, void 0, function () {
        var state, userId, missionRef, missionDoc, missionData, deletePromises;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    state = getState();
                    userId = (_b = state.auth.user) === null || _b === void 0 ? void 0 : _b.id;
                    if (!userId) {
                        throw new Error('User not authenticated');
                    }
                    missionRef = (0, firestore_1.default)().collection('missions').doc(missionId);
                    return [4 /*yield*/, missionRef.get()];
                case 1:
                    missionDoc = _c.sent();
                    if (!missionDoc.exists) {
                        throw new Error('Mission not found');
                    }
                    missionData = missionDoc.data();
                    if ((missionData === null || missionData === void 0 ? void 0 : missionData.createdBy) !== userId) {
                        throw new Error('Unauthorized to delete this mission');
                    }
                    if (!((missionData === null || missionData === void 0 ? void 0 : missionData.imageUrls) && missionData.imageUrls.length > 0)) return [3 /*break*/, 3];
                    deletePromises = missionData.imageUrls.map(function (url) {
                        try {
                            var ref = (0, storage_1.default)().refFromURL(url);
                            return ref.delete();
                        }
                        catch (error) {
                            console.error('Error deleting image:', error);
                            return Promise.resolve();
                        }
                    });
                    return [4 /*yield*/, Promise.all(deletePromises)];
                case 2:
                    _c.sent();
                    _c.label = 3;
                case 3: return [4 /*yield*/, missionRef.delete()];
                case 4:
                    _c.sent();
                    return [2 /*return*/, missionId];
            }
        });
    });
});
// Update mission status
exports.updateMissionStatus = (0, toolkit_1.createAsyncThunk)('admin/updateMissionStatus', function (_a, _b) {
    var missionId = _a.missionId, status = _a.status;
    var getState = _b.getState;
    return __awaiter(void 0, void 0, void 0, function () {
        var state, userId, missionRef, missionDoc, missionData;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    state = getState();
                    userId = (_c = state.auth.user) === null || _c === void 0 ? void 0 : _c.id;
                    if (!userId) {
                        throw new Error('User not authenticated');
                    }
                    missionRef = (0, firestore_1.default)().collection('missions').doc(missionId);
                    return [4 /*yield*/, missionRef.get()];
                case 1:
                    missionDoc = _d.sent();
                    if (!missionDoc.exists) {
                        throw new Error('Mission not found');
                    }
                    missionData = missionDoc.data();
                    if ((missionData === null || missionData === void 0 ? void 0 : missionData.createdBy) !== userId) {
                        throw new Error('Unauthorized to update this mission');
                    }
                    return [4 /*yield*/, missionRef.update({
                            status: status,
                            updatedAt: firestore_1.default.FieldValue.serverTimestamp(),
                        })];
                case 2:
                    _d.sent();
                    return [2 /*return*/, { missionId: missionId, status: status }];
            }
        });
    });
});
// Fetch mission participants
exports.fetchMissionParticipants = (0, toolkit_1.createAsyncThunk)('admin/fetchMissionParticipants', function (missionId) { return __awaiter(void 0, void 0, void 0, function () {
    var snapshot, participants;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, firestore_1.default)()
                    .collection('missions')
                    .doc(missionId)
                    .collection('participants')
                    .orderBy('joinedAt', 'desc')
                    .get()];
            case 1:
                snapshot = _a.sent();
                participants = snapshot.docs.map(function (doc) {
                    var _a, _b;
                    return (__assign(__assign({ userId: doc.id }, doc.data()), { joinedAt: (_a = doc.data().joinedAt) === null || _a === void 0 ? void 0 : _a.toDate(), completedAt: (_b = doc.data().completedAt) === null || _b === void 0 ? void 0 : _b.toDate() }));
                });
                return [2 /*return*/, { missionId: missionId, participants: participants }];
        }
    });
}); });
// Fetch mission analytics
exports.fetchMissionAnalytics = (0, toolkit_1.createAsyncThunk)('admin/fetchMissionAnalytics', function (missionId) { return __awaiter(void 0, void 0, void 0, function () {
    var missionDoc, participantsSnapshot, totalParticipants, completedParticipants, missionData, totalPointsAwarded, engagementRate, analytics;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, firestore_1.default)().collection('missions').doc(missionId).get()];
            case 1:
                missionDoc = _a.sent();
                if (!missionDoc.exists) {
                    throw new Error('Mission not found');
                }
                return [4 /*yield*/, (0, firestore_1.default)()
                        .collection('missions')
                        .doc(missionId)
                        .collection('participants')
                        .get()];
            case 2:
                participantsSnapshot = _a.sent();
                totalParticipants = participantsSnapshot.size;
                completedParticipants = participantsSnapshot.docs.filter(function (doc) { return doc.data().status === 'completed'; }).length;
                missionData = missionDoc.data();
                totalPointsAwarded = completedParticipants * ((missionData === null || missionData === void 0 ? void 0 : missionData.pointsReward) || 0);
                engagementRate = totalParticipants > 0
                    ? (completedParticipants / totalParticipants) * 100
                    : 0;
                analytics = {
                    missionId: missionId,
                    totalParticipants: totalParticipants,
                    completedParticipants: completedParticipants,
                    totalPointsAwarded: totalPointsAwarded,
                    engagementRate: engagementRate,
                };
                return [2 /*return*/, analytics];
        }
    });
}); });
// Bulk update mission status
exports.bulkUpdateMissionStatus = (0, toolkit_1.createAsyncThunk)('admin/bulkUpdateMissionStatus', function (_a, _b) {
    var missionIds = _a.missionIds, status = _a.status;
    var getState = _b.getState;
    return __awaiter(void 0, void 0, void 0, function () {
        var state, userId, batch, _i, missionIds_1, missionId, missionRef;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    state = getState();
                    userId = (_c = state.auth.user) === null || _c === void 0 ? void 0 : _c.id;
                    if (!userId) {
                        throw new Error('User not authenticated');
                    }
                    batch = (0, firestore_1.default)().batch();
                    for (_i = 0, missionIds_1 = missionIds; _i < missionIds_1.length; _i++) {
                        missionId = missionIds_1[_i];
                        missionRef = (0, firestore_1.default)().collection('missions').doc(missionId);
                        batch.update(missionRef, {
                            status: status,
                            updatedAt: firestore_1.default.FieldValue.serverTimestamp(),
                        });
                    }
                    return [4 /*yield*/, batch.commit()];
                case 1:
                    _d.sent();
                    return [2 /*return*/, { missionIds: missionIds, status: status }];
            }
        });
    });
});
// Bulk delete missions
exports.bulkDeleteMissions = (0, toolkit_1.createAsyncThunk)('admin/bulkDeleteMissions', function (missionIds, _a) {
    var getState = _a.getState;
    return __awaiter(void 0, void 0, void 0, function () {
        var state, userId, batch, _i, missionIds_2, missionId, missionRef;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    state = getState();
                    userId = (_b = state.auth.user) === null || _b === void 0 ? void 0 : _b.id;
                    if (!userId) {
                        throw new Error('User not authenticated');
                    }
                    batch = (0, firestore_1.default)().batch();
                    for (_i = 0, missionIds_2 = missionIds; _i < missionIds_2.length; _i++) {
                        missionId = missionIds_2[_i];
                        missionRef = (0, firestore_1.default)().collection('missions').doc(missionId);
                        batch.delete(missionRef);
                    }
                    return [4 /*yield*/, batch.commit()];
                case 1:
                    _c.sent();
                    return [2 /*return*/, missionIds];
            }
        });
    });
});
var adminSlice = (0, toolkit_1.createSlice)({
    name: 'admin',
    initialState: initialState,
    reducers: {
        setSelectedMission: function (state, action) {
            state.selectedMission = action.payload;
        },
        clearError: function (state) {
            state.error = null;
        },
        setUploadProgress: function (state, action) {
            state.uploadProgress = action.payload;
        },
        resetUploadProgress: function (state) {
            state.uploadProgress = 0;
        },
    },
    extraReducers: function (builder) {
        builder
            // Fetch all missions
            .addCase(exports.fetchAllMissions.pending, function (state) {
            state.loading = true;
            state.error = null;
        })
            .addCase(exports.fetchAllMissions.fulfilled, function (state, action) {
            state.loading = false;
            state.missions = action.payload;
        })
            .addCase(exports.fetchAllMissions.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch missions';
        })
            // Create mission
            .addCase(exports.createMission.pending, function (state) {
            state.loading = true;
            state.error = null;
            state.uploadProgress = 0;
        })
            .addCase(exports.createMission.fulfilled, function (state, action) {
            state.loading = false;
            state.missions.unshift(action.payload);
            state.uploadProgress = 0;
        })
            .addCase(exports.createMission.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to create mission';
            state.uploadProgress = 0;
        })
            // Update mission
            .addCase(exports.updateMission.pending, function (state) {
            state.loading = true;
            state.error = null;
            state.uploadProgress = 0;
        })
            .addCase(exports.updateMission.fulfilled, function (state, action) {
            var _a;
            state.loading = false;
            var index = state.missions.findIndex(function (m) { return m.id === action.payload.id; });
            if (index !== -1) {
                state.missions[index] = action.payload;
            }
            if (((_a = state.selectedMission) === null || _a === void 0 ? void 0 : _a.id) === action.payload.id) {
                state.selectedMission = action.payload;
            }
            state.uploadProgress = 0;
        })
            .addCase(exports.updateMission.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to update mission';
            state.uploadProgress = 0;
        })
            // Delete mission
            .addCase(exports.deleteMission.pending, function (state) {
            state.loading = true;
            state.error = null;
        })
            .addCase(exports.deleteMission.fulfilled, function (state, action) {
            var _a;
            state.loading = false;
            state.missions = state.missions.filter(function (m) { return m.id !== action.payload; });
            if (((_a = state.selectedMission) === null || _a === void 0 ? void 0 : _a.id) === action.payload) {
                state.selectedMission = null;
            }
        })
            .addCase(exports.deleteMission.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to delete mission';
        })
            // Update mission status
            .addCase(exports.updateMissionStatus.pending, function (state) {
            state.loading = true;
            state.error = null;
        })
            .addCase(exports.updateMissionStatus.fulfilled, function (state, action) {
            var _a;
            state.loading = false;
            var index = state.missions.findIndex(function (m) { return m.id === action.payload.missionId; });
            if (index !== -1) {
                state.missions[index].status = action.payload.status;
            }
            if (((_a = state.selectedMission) === null || _a === void 0 ? void 0 : _a.id) === action.payload.missionId) {
                state.selectedMission.status = action.payload.status;
            }
        })
            .addCase(exports.updateMissionStatus.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to update mission status';
        })
            // Fetch participants
            .addCase(exports.fetchMissionParticipants.pending, function (state) {
            state.loading = true;
            state.error = null;
        })
            .addCase(exports.fetchMissionParticipants.fulfilled, function (state, action) {
            state.loading = false;
            state.participants[action.payload.missionId] = action.payload.participants;
        })
            .addCase(exports.fetchMissionParticipants.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch participants';
        })
            // Fetch analytics
            .addCase(exports.fetchMissionAnalytics.pending, function (state) {
            state.loading = true;
            state.error = null;
        })
            .addCase(exports.fetchMissionAnalytics.fulfilled, function (state, action) {
            state.loading = false;
            state.analytics[action.payload.missionId] = action.payload;
        })
            .addCase(exports.fetchMissionAnalytics.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch analytics';
        })
            // Bulk update status
            .addCase(exports.bulkUpdateMissionStatus.pending, function (state) {
            state.loading = true;
            state.error = null;
        })
            .addCase(exports.bulkUpdateMissionStatus.fulfilled, function (state, action) {
            state.loading = false;
            action.payload.missionIds.forEach(function (missionId) {
                var index = state.missions.findIndex(function (m) { return m.id === missionId; });
                if (index !== -1) {
                    state.missions[index].status = action.payload.status;
                }
            });
        })
            .addCase(exports.bulkUpdateMissionStatus.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to bulk update missions';
        })
            // Bulk delete
            .addCase(exports.bulkDeleteMissions.pending, function (state) {
            state.loading = true;
            state.error = null;
        })
            .addCase(exports.bulkDeleteMissions.fulfilled, function (state, action) {
            state.loading = false;
            state.missions = state.missions.filter(function (m) { return !action.payload.includes(m.id); });
        })
            .addCase(exports.bulkDeleteMissions.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to bulk delete missions';
        });
    },
});
exports.setSelectedMission = (_a = adminSlice.actions, _a.setSelectedMission), exports.clearError = _a.clearError, exports.setUploadProgress = _a.setUploadProgress, exports.resetUploadProgress = _a.resetUploadProgress;
exports.default = adminSlice.reducer;
