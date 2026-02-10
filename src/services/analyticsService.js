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
exports.useLazyGetCSRMetricsQuery = exports.useGetMissionAnalyticsQuery = exports.useGetCSRMetricsQuery = exports.analyticsApi = void 0;
var react_1 = require("@reduxjs/toolkit/query/react");
var firestore_1 = __importDefault(require("@react-native-firebase/firestore"));
exports.analyticsApi = (0, react_1.createApi)({
    reducerPath: 'analyticsApi',
    baseQuery: (0, react_1.fakeBaseQuery)(),
    tagTypes: ['Analytics'],
    endpoints: function (builder) { return ({
        getCSRMetrics: builder.query({
            queryFn: function (_a) {
                var _b, _c, _d, _e;
                var companyId = _a.companyId, dateRange = _a.dateRange;
                return __awaiter(this, void 0, void 0, function () {
                    var startTimestamp, endTimestamp, missionsSnapshot, missions, totalParticipants, totalPointsDistributed, categoryMap, cityMap, participationByDate, sponsoredMissions, _i, missions_1, mission, participantsSnapshot, participantCount, pointsForMission, category, city, dateStr, completionRate, engagementScore, impactScore, participationOverTime, totalMissions_1, missionCategories, geographicDistribution, metrics, error_1;
                    return __generator(this, function (_f) {
                        switch (_f.label) {
                            case 0:
                                _f.trys.push([0, 6, , 7]);
                                startTimestamp = firestore_1.default.Timestamp.fromDate(dateRange.startDate);
                                endTimestamp = firestore_1.default.Timestamp.fromDate(dateRange.endDate);
                                return [4 /*yield*/, (0, firestore_1.default)()
                                        .collection('missions')
                                        .where('sponsorId', '==', companyId)
                                        .where('createdAt', '>=', startTimestamp)
                                        .where('createdAt', '<=', endTimestamp)
                                        .get()];
                            case 1:
                                missionsSnapshot = _f.sent();
                                missions = missionsSnapshot.docs.map(function (doc) { return (__assign({ id: doc.id }, doc.data())); });
                                totalParticipants = 0;
                                totalPointsDistributed = 0;
                                categoryMap = new Map();
                                cityMap = new Map();
                                participationByDate = new Map();
                                sponsoredMissions = [];
                                _i = 0, missions_1 = missions;
                                _f.label = 2;
                            case 2:
                                if (!(_i < missions_1.length)) return [3 /*break*/, 5];
                                mission = missions_1[_i];
                                return [4 /*yield*/, (0, firestore_1.default)()
                                        .collection('missions')
                                        .doc(mission.id)
                                        .collection('participants')
                                        .get()];
                            case 3:
                                participantsSnapshot = _f.sent();
                                participantCount = participantsSnapshot.size;
                                totalParticipants += participantCount;
                                pointsForMission = mission.pointsReward * participantCount;
                                totalPointsDistributed += pointsForMission;
                                category = mission.category || 'other';
                                categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
                                city = ((_b = mission.location) === null || _b === void 0 ? void 0 : _b.city) || 'Unknown';
                                cityMap.set(city, (cityMap.get(city) || 0) + participantCount);
                                dateStr = ((_e = (_d = (_c = mission.date) === null || _c === void 0 ? void 0 : _c.toDate) === null || _d === void 0 ? void 0 : _d.call(_c)) === null || _e === void 0 ? void 0 : _e.toLocaleDateString()) || 'Unknown';
                                participationByDate.set(dateStr, (participationByDate.get(dateStr) || 0) + participantCount);
                                completionRate = participantCount > 0
                                    ? Math.min(100, (participantCount / (mission.maxParticipants || participantCount)) * 100)
                                    : 0;
                                engagementScore = calculateEngagementScore(participantCount, completionRate, pointsForMission);
                                sponsoredMissions.push({
                                    id: mission.id,
                                    title: mission.title,
                                    date: dateStr,
                                    participants: participantCount,
                                    pointsDistributed: pointsForMission,
                                    completionRate: Math.round(completionRate),
                                    engagementScore: engagementScore,
                                });
                                _f.label = 4;
                            case 4:
                                _i++;
                                return [3 /*break*/, 2];
                            case 5:
                                impactScore = calculateImpactScore(totalParticipants, totalPointsDistributed, missions.length);
                                participationOverTime = Array.from(participationByDate.entries())
                                    .map(function (_a) {
                                    var date = _a[0], participants = _a[1];
                                    return ({ date: date, participants: participants });
                                })
                                    .sort(function (a, b) { return new Date(a.date).getTime() - new Date(b.date).getTime(); });
                                totalMissions_1 = missions.length;
                                missionCategories = Array.from(categoryMap.entries())
                                    .map(function (_a) {
                                    var category = _a[0], count = _a[1];
                                    return ({
                                        category: formatCategoryName(category),
                                        count: count,
                                        percentage: (count / totalMissions_1) * 100,
                                    });
                                })
                                    .sort(function (a, b) { return b.count - a.count; });
                                geographicDistribution = Array.from(cityMap.entries())
                                    .map(function (_a) {
                                    var city = _a[0], participants = _a[1];
                                    return ({ city: city, participants: participants });
                                })
                                    .sort(function (a, b) { return b.participants - a.participants; });
                                metrics = {
                                    totalParticipants: totalParticipants,
                                    totalPointsDistributed: totalPointsDistributed,
                                    totalMissionsSponsored: missions.length,
                                    impactScore: impactScore,
                                    participationOverTime: participationOverTime,
                                    missionCategories: missionCategories,
                                    geographicDistribution: geographicDistribution,
                                    sponsoredMissions: sponsoredMissions,
                                };
                                return [2 /*return*/, { data: metrics }];
                            case 6:
                                error_1 = _f.sent();
                                console.error('Error fetching CSR metrics:', error_1);
                                return [2 /*return*/, {
                                        error: {
                                            status: 'CUSTOM_ERROR',
                                            error: error_1 instanceof Error ? error_1.message : 'Failed to fetch analytics data',
                                        },
                                    }];
                            case 7: return [2 /*return*/];
                        }
                    });
                });
            },
            providesTags: ['Analytics'],
        }),
        getMissionAnalytics: builder.query({
            queryFn: function (missionId) {
                var _a, _b, _c;
                return __awaiter(this, void 0, void 0, function () {
                    var missionDoc, mission, participantsSnapshot, participantCount, pointsDistributed, completionRate, engagementScore, metrics, error_2;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                _d.trys.push([0, 3, , 4]);
                                return [4 /*yield*/, (0, firestore_1.default)()
                                        .collection('missions')
                                        .doc(missionId)
                                        .get()];
                            case 1:
                                missionDoc = _d.sent();
                                if (!missionDoc.exists) {
                                    throw new Error('Mission not found');
                                }
                                mission = missionDoc.data();
                                return [4 /*yield*/, (0, firestore_1.default)()
                                        .collection('missions')
                                        .doc(missionId)
                                        .collection('participants')
                                        .get()];
                            case 2:
                                participantsSnapshot = _d.sent();
                                participantCount = participantsSnapshot.size;
                                pointsDistributed = ((mission === null || mission === void 0 ? void 0 : mission.pointsReward) || 0) * participantCount;
                                completionRate = participantCount > 0
                                    ? Math.min(100, (participantCount / ((mission === null || mission === void 0 ? void 0 : mission.maxParticipants) || participantCount)) * 100)
                                    : 0;
                                engagementScore = calculateEngagementScore(participantCount, completionRate, pointsDistributed);
                                metrics = {
                                    id: missionId,
                                    title: (mission === null || mission === void 0 ? void 0 : mission.title) || 'Unknown Mission',
                                    date: ((_c = (_b = (_a = mission === null || mission === void 0 ? void 0 : mission.date) === null || _a === void 0 ? void 0 : _a.toDate) === null || _b === void 0 ? void 0 : _b.call(_a)) === null || _c === void 0 ? void 0 : _c.toLocaleDateString()) || 'Unknown',
                                    participants: participantCount,
                                    pointsDistributed: pointsDistributed,
                                    completionRate: Math.round(completionRate),
                                    engagementScore: engagementScore,
                                };
                                return [2 /*return*/, { data: metrics }];
                            case 3:
                                error_2 = _d.sent();
                                console.error('Error fetching mission analytics:', error_2);
                                return [2 /*return*/, {
                                        error: {
                                            status: 'CUSTOM_ERROR',
                                            error: error_2 instanceof Error ? error_2.message : 'Failed to fetch mission analytics',
                                        },
                                    }];
                            case 4: return [2 /*return*/];
                        }
                    });
                });
            },
        }),
    }); },
});
// Helper function to calculate engagement score (0-10 scale)
function calculateEngagementScore(participants, completionRate, pointsDistributed) {
    // Weighted formula: 40% participants, 30% completion rate, 30% points
    var participantScore = Math.min(10, (participants / 100) * 10);
    var completionScore = (completionRate / 100) * 10;
    var pointsScore = Math.min(10, (pointsDistributed / 10000) * 10);
    return (participantScore * 0.4 + completionScore * 0.3 + pointsScore * 0.3);
}
// Helper function to calculate overall impact score (0-10 scale)
function calculateImpactScore(totalParticipants, totalPoints, totalMissions) {
    // Weighted formula based on scale and reach
    var participantScore = Math.min(10, (totalParticipants / 500) * 10);
    var pointsScore = Math.min(10, (totalPoints / 50000) * 10);
    var missionScore = Math.min(10, (totalMissions / 20) * 10);
    return (participantScore * 0.4 + pointsScore * 0.3 + missionScore * 0.3);
}
// Helper function to format category names
function formatCategoryName(category) {
    return category
        .split('_')
        .map(function (word) { return word.charAt(0).toUpperCase() + word.slice(1); })
        .join(' ');
}
exports.useGetCSRMetricsQuery = exports.analyticsApi.useGetCSRMetricsQuery, exports.useGetMissionAnalyticsQuery = exports.analyticsApi.useGetMissionAnalyticsQuery, exports.useLazyGetCSRMetricsQuery = exports.analyticsApi.useLazyGetCSRMetricsQuery;
