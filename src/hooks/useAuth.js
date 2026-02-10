"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAuth = void 0;
var react_1 = require("react");
var authSlice_1 = require("@store/slices/authSlice");
var _store_1 = require("@store");
var authService_1 = require("@services/authService");
/**
 * Custom hook for authentication operations
 * Provides easy access to auth state and actions
 */
var useAuth = function () {
    var dispatch = (0, _store_1.useAppDispatch)();
    var user = (0, _store_1.useAppSelector)(authSlice_1.selectUser);
    var isAuthenticated = (0, _store_1.useAppSelector)(authSlice_1.selectIsAuthenticated);
    var isLoading = (0, _store_1.useAppSelector)(authSlice_1.selectIsLoading);
    var isInitializing = (0, _store_1.useAppSelector)(authSlice_1.selectIsInitializing);
    var error = (0, _store_1.useAppSelector)(authSlice_1.selectAuthError);
    // Initialize auth state on mount
    (0, react_1.useEffect)(function () {
        var unsubscribe = authService_1.AuthService.onAuthStateChanged(function (firebaseUser) {
            dispatch((0, authSlice_1.initializeAuth)(firebaseUser));
        });
        return unsubscribe;
    }, [dispatch]);
    var signInWithEmail = function (email, password) {
        return dispatch((0, authSlice_1.signInWithEmail)({ email: email, password: password }));
    };
    var signUpWithEmail = function (email, password, displayName) {
        return dispatch((0, authSlice_1.signUpWithEmail)({ email: email, password: password, displayName: displayName }));
    };
    var signInWithGoogle = function () {
        return dispatch((0, authSlice_1.signInWithGoogle)());
    };
    var signInWithApple = function () {
        return dispatch((0, authSlice_1.signInWithApple)());
    };
    var signOut = function () {
        return dispatch((0, authSlice_1.signOut)());
    };
    var clearAuthError = function () {
        dispatch((0, authSlice_1.clearError)());
    };
    return {
        // State
        user: user,
        isAuthenticated: isAuthenticated,
        isLoading: isLoading,
        isInitializing: isInitializing,
        error: error,
        // Actions
        signInWithEmail: signInWithEmail,
        signUpWithEmail: signUpWithEmail,
        signInWithGoogle: signInWithGoogle,
        signInWithApple: signInWithApple,
        signOut: signOut,
        clearAuthError: clearAuthError,
    };
};
exports.useAuth = useAuth;
