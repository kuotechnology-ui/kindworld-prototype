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
exports.unregisterFromMission = exports.registerForMission = exports.clearError = exports.clearMissions = exports.setSortBy = exports.setFilters = exports.loadFavorites = exports.toggleFavorite = exports.fetchMissionById = exports.fetchMissions = void 0;
var toolkit_1 = require("@reduxjs/toolkit");
var firestore_1 = __importDefault(require("@react-native-firebase/firestore"));
var initialState = {
    missions: [],
    favorites: new Set(),
    registeredMissionIds: [],
    loading: false,
    error: null,
    hasMore: true,
    lastDoc: null,
    filters: {},
    sortBy: 'date',
};
var PAGE_SIZE = 10;
// Fetch missions with filters and pagination
exports.fetchMissions = (0, toolkit_1.createAsyncThunk)('missions/fetchMissions', function (_a, _b) {
    var filters = _a.filters, sortBy = _a.sortBy, _c = _a.reset, reset = _c === void 0 ? false : _c;
    var getState = _b.getState;
    return __awaiter(void 0, void 0, void 0, function () {
        var state, query, now, startDate, snapshot, missions, lastDoc, hasMore;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    state = getState();
                    query = (0, firestore_1.default)()
                        .collection('missions')
                        .where('status', '==', 'published');
                    // Apply filters
                    if (filters.category) {
                        query = query.where('category', '==', filters.category);
                    }
                    if (filters.dateRange) {
                        now = new Date();
                        startDate = new Date();
                        switch (filters.dateRange) {
                            case 'today':
                                startDate.setHours(0, 0, 0, 0);
                                break;
                            case 'week':
                                startDate.setDate(now.getDate() - 7);
                                break;
                            case 'month':
                                startDate.setMonth(now.getMonth() - 1);
                                break;
                            case 'all':
                            default:
                                startDate = new Date(0); // Beginning of time
                        }
                        query = query.where('date', '>=', firestore_1.default.Timestamp.fromDate(startDate));
                    }
                    // Apply sorting
                    switch (sortBy) {
                        case 'date':
                            query = query.orderBy('date', 'asc');
                            break;
                        case 'relevance':
                            query = query.orderBy('pointsReward', 'desc');
                            break;
                        case 'distance':
                            // For distance sorting, we would need geolocation queries
                            // For now, default to date sorting
                            query = query.orderBy('date', 'asc');
                            break;
                    }
                    // Pagination
                    if (!reset && state.missions.lastDoc) {
                        query = query.startAfter(state.missions.lastDoc);
                    }
                    query = query.limit(PAGE_SIZE);
                    return [4 /*yield*/, query.get()];
                case 1:
                    snapshot = _d.sent();
                    missions = snapshot.docs.map(function (doc) { return (__assign({ id: doc.id }, doc.data())); });
                    lastDoc = snapshot.docs[snapshot.docs.length - 1] || null;
                    hasMore = snapshot.docs.length === PAGE_SIZE;
                    return [2 /*return*/, { missions: missions, lastDoc: lastDoc, hasMore: hasMore, reset: reset }];
            }
        });
    });
});
// Fetch a single mission by ID
exports.fetchMissionById = (0, toolkit_1.createAsyncThunk)('missions/fetchMissionById', function (missionId) { return __awaiter(void 0, void 0, void 0, function () {
    var doc;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, firestore_1.default)().collection('missions').doc(missionId).get()];
            case 1:
                doc = _a.sent();
                if (!doc.exists) {
                    throw new Error('Mission not found');
                }
                return [2 /*return*/, __assign({ id: doc.id }, doc.data())];
        }
    });
}); });
// Toggle favorite status
exports.toggleFavorite = (0, toolkit_1.createAsyncThunk)('missions/toggleFavorite', function (missionId, _a) {
    var getState = _a.getState;
    return __awaiter(void 0, void 0, void 0, function () {
        var state, userId, isFavorite, userRef;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    state = getState();
                    userId = (_b = state.auth.user) === null || _b === void 0 ? void 0 : _b.id;
                    if (!userId) {
                        throw new Error('User not authenticated');
                    }
                    isFavorite = state.missions.favorites.has(missionId);
                    userRef = (0, firestore_1.default)().collection('users').doc(userId);
                    if (!isFavorite) return [3 /*break*/, 2];
                    return [4 /*yield*/, userRef.update({
                            favoriteMissions: firestore_1.default.FieldValue.arrayRemove(missionId),
                        })];
                case 1:
                    _c.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, userRef.update({
                        favoriteMissions: firestore_1.default.FieldValue.arrayUnion(missionId),
                    })];
                case 3:
                    _c.sent();
                    _c.label = 4;
                case 4: return [2 /*return*/, { missionId: missionId, isFavorite: !isFavorite }];
            }
        });
    });
});
// Load user's favorite missions
exports.loadFavorites = (0, toolkit_1.createAsyncThunk)('missions/loadFavorites', function (_, _a) {
    var getState = _a.getState;
    return __awaiter(void 0, void 0, void 0, function () {
        var state, userId, userDoc, userData;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    state = getState();
                    userId = (_b = state.auth.user) === null || _b === void 0 ? void 0 : _b.id;
                    if (!userId) {
                        return [2 /*return*/, []];
                    }
                    return [4 /*yield*/, (0, firestore_1.default)().collection('users').doc(userId).get()];
                case 1:
                    userDoc = _c.sent();
                    userData = userDoc.data();
                    return [2 /*return*/, ((userData === null || userData === void 0 ? void 0 : userData.favoriteMissions) || [])];
            }
        });
    });
});
var missionsSlice = (0, toolkit_1.createSlice)({
    name: 'missions',
    initialState: initialState,
    reducers: {
        setFilters: function (state, action) {
            state.filters = action.payload;
        },
        setSortBy: function (state, action) {
            state.sortBy = action.payload;
        },
        clearMissions: function (state) {
            state.missions = [];
            state.lastDoc = null;
            state.hasMore = true;
        },
        clearError: function (state) {
            state.error = null;
        },
        registerForMission: function (state, action) {
            var missionId = action.payload;
            if (!state.registeredMissionIds.includes(missionId)) {
                state.registeredMissionIds.push(missionId);
                // Update participant count in the mission
                var mission = state.missions.find(function (m) { return m.id === missionId; });
                if (mission) {
                    mission.currentParticipants = (mission.currentParticipants || 0) + 1;
                }
            }
        },
        unregisterFromMission: function (state, action) {
            var missionId = action.payload;
            state.registeredMissionIds = state.registeredMissionIds.filter(function (id) { return id !== missionId; });
            // Update participant count in the mission
            var mission = state.missions.find(function (m) { return m.id === missionId; });
            if (mission && mission.currentParticipants > 0) {
                mission.currentParticipants -= 1;
            }
        },
    },
    extraReducers: function (builder) {
        builder
            // Fetch missions
            .addCase(exports.fetchMissions.pending, function (state) {
            state.loading = true;
            state.error = null;
        })
            .addCase(exports.fetchMissions.fulfilled, function (state, action) {
            state.loading = false;
            if (action.payload.reset) {
                state.missions = action.payload.missions;
            }
            else {
                state.missions = __spreadArray(__spreadArray([], state.missions, true), action.payload.missions, true);
            }
            state.lastDoc = action.payload.lastDoc;
            state.hasMore = action.payload.hasMore;
        })
            .addCase(exports.fetchMissions.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch missions';
        })
            // Fetch mission by ID
            .addCase(exports.fetchMissionById.pending, function (state) {
            state.loading = true;
            state.error = null;
        })
            .addCase(exports.fetchMissionById.fulfilled, function (state, action) {
            state.loading = false;
            // Update or add the mission to the list
            var index = state.missions.findIndex(function (m) { return m.id === action.payload.id; });
            if (index !== -1) {
                state.missions[index] = action.payload;
            }
            else {
                state.missions.unshift(action.payload);
            }
        })
            .addCase(exports.fetchMissionById.rejected, function (state, action) {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch mission';
        })
            // Toggle favorite
            .addCase(exports.toggleFavorite.fulfilled, function (state, action) {
            if (action.payload.isFavorite) {
                state.favorites.add(action.payload.missionId);
            }
            else {
                state.favorites.delete(action.payload.missionId);
            }
        })
            // Load favorites
            .addCase(exports.loadFavorites.fulfilled, function (state, action) {
            state.favorites = new Set(action.payload);
        });
    },
});
exports.setFilters = (_a = missionsSlice.actions, _a.setFilters), exports.setSortBy = _a.setSortBy, exports.clearMissions = _a.clearMissions, exports.clearError = _a.clearError, exports.registerForMission = _a.registerForMission, exports.unregisterFromMission = _a.unregisterFromMission;
exports.default = missionsSlice.reducer;
