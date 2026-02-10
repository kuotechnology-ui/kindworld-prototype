"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetAnalytics = exports.clearError = exports.setError = exports.setLoading = exports.setDateRange = exports.setMetrics = void 0;
var toolkit_1 = require("@reduxjs/toolkit");
var initialState = {
    metrics: null,
    dateRange: {
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        endDate: new Date(),
    },
    isLoading: false,
    error: null,
    lastUpdated: null,
};
var analyticsSlice = (0, toolkit_1.createSlice)({
    name: 'analytics',
    initialState: initialState,
    reducers: {
        setMetrics: function (state, action) {
            state.metrics = action.payload;
            state.lastUpdated = Date.now();
            state.error = null;
        },
        setDateRange: function (state, action) {
            state.dateRange = action.payload;
        },
        setLoading: function (state, action) {
            state.isLoading = action.payload;
        },
        setError: function (state, action) {
            state.error = action.payload;
            state.isLoading = false;
        },
        clearError: function (state) {
            state.error = null;
        },
        resetAnalytics: function (state) {
            state.metrics = null;
            state.error = null;
            state.lastUpdated = null;
        },
    },
});
exports.setMetrics = (_a = analyticsSlice.actions, _a.setMetrics), exports.setDateRange = _a.setDateRange, exports.setLoading = _a.setLoading, exports.setError = _a.setError, exports.clearError = _a.clearError, exports.resetAnalytics = _a.resetAnalytics;
exports.default = analyticsSlice.reducer;
