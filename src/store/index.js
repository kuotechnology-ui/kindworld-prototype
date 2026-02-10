"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAppSelector = exports.useAppDispatch = exports.store = void 0;
var toolkit_1 = require("@reduxjs/toolkit");
var react_redux_1 = require("react-redux");
var authSlice_1 = __importDefault(require("./slices/authSlice"));
var dashboardSlice_1 = __importDefault(require("./slices/dashboardSlice"));
var missionsSlice_1 = __importDefault(require("./slices/missionsSlice"));
var pointsSlice_1 = __importDefault(require("./slices/pointsSlice"));
var analyticsSlice_1 = __importDefault(require("./slices/analyticsSlice"));
var adminSlice_1 = __importDefault(require("./slices/adminSlice"));
var analyticsService_1 = require("../services/analyticsService");
var persistenceMiddleware_1 = require("./middleware/persistenceMiddleware");
exports.store = (0, toolkit_1.configureStore)({
    reducer: (_a = {
            auth: authSlice_1.default,
            dashboard: dashboardSlice_1.default,
            missions: missionsSlice_1.default,
            points: pointsSlice_1.default,
            analytics: analyticsSlice_1.default,
            admin: adminSlice_1.default
        },
        _a[analyticsService_1.analyticsApi.reducerPath] = analyticsService_1.analyticsApi.reducer,
        _a),
    middleware: function (getDefaultMiddleware) {
        return getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    'auth/setUser',
                    'missions/fetchMissions/fulfilled',
                    'missions/fetchMissionById/fulfilled',
                    'points/fetchTransactionHistory/fulfilled',
                    'points/awardMissionPoints/fulfilled',
                    'points/awardBonus/fulfilled',
                    'points/makeAdjustment/fulfilled',
                    'analytics/setDateRange',
                    'admin/fetchAllMissions/fulfilled',
                    'admin/createMission/fulfilled',
                    'admin/updateMission/fulfilled',
                    'admin/fetchMissionParticipants/fulfilled',
                    'admin/fetchMissionAnalytics/fulfilled',
                ],
                ignoredPaths: [
                    'auth.user.createdAt',
                    'auth.user.updatedAt',
                    'missions.missions',
                    'missions.lastDoc',
                    'points.transactions',
                    'analytics.dateRange',
                    'admin.missions',
                    'admin.selectedMission',
                    'admin.participants',
                ],
            },
        })
            .concat(analyticsService_1.analyticsApi.middleware)
            .concat(persistenceMiddleware_1.persistenceMiddleware);
    },
});
exports.useAppDispatch = react_redux_1.useDispatch;
exports.useAppSelector = react_redux_1.useSelector;
