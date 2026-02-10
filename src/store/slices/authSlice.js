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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserProfile = exports.setSessionToken = exports.clearError = exports.setError = exports.setLoading = exports.setUser = exports.selectSessionToken = exports.selectAuthError = exports.selectIsInitializing = exports.selectIsLoading = exports.selectIsAuthenticated = exports.selectUser = exports.selectAuth = exports.initializeAuth = exports.refreshSessionToken = exports.signOut = exports.signInWithApple = exports.signInWithGoogle = exports.signUpWithEmail = exports.signInWithEmail = void 0;
var toolkit_1 = require("@reduxjs/toolkit");
var authService_1 = require("@services/authService");
var firebase_1 = require("@services/firebase");
var initialState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    isInitializing: true,
    error: null,
    sessionToken: null,
};
// Async thunk for email sign-in
exports.signInWithEmail = (0, toolkit_1.createAsyncThunk)('auth/signInWithEmail', function (_a, _b) {
    var email = _a.email, password = _a.password;
    var rejectWithValue = _b.rejectWithValue;
    return __awaiter(void 0, void 0, void 0, function () {
        var userCredential, user, error_1, authError;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, authService_1.AuthService.signInWithEmail(email, password)];
                case 1:
                    userCredential = _c.sent();
                    return [4 /*yield*/, fetchUserData(userCredential.user.uid)];
                case 2:
                    user = _c.sent();
                    return [2 /*return*/, user];
                case 3:
                    error_1 = _c.sent();
                    authError = error_1;
                    return [2 /*return*/, rejectWithValue(authError.userMessage)];
                case 4: return [2 /*return*/];
            }
        });
    });
});
// Async thunk for email sign-up
exports.signUpWithEmail = (0, toolkit_1.createAsyncThunk)('auth/signUpWithEmail', function (_a, _b) {
    var email = _a.email, password = _a.password, displayName = _a.displayName;
    var rejectWithValue = _b.rejectWithValue;
    return __awaiter(void 0, void 0, void 0, function () {
        var userCredential, user, error_2, authError;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, authService_1.AuthService.signUpWithEmail(email, password, displayName)];
                case 1:
                    userCredential = _c.sent();
                    return [4 /*yield*/, fetchUserData(userCredential.user.uid)];
                case 2:
                    user = _c.sent();
                    return [2 /*return*/, user];
                case 3:
                    error_2 = _c.sent();
                    authError = error_2;
                    return [2 /*return*/, rejectWithValue(authError.userMessage)];
                case 4: return [2 /*return*/];
            }
        });
    });
});
// Async thunk for Google sign-in
exports.signInWithGoogle = (0, toolkit_1.createAsyncThunk)('auth/signInWithGoogle', function (_, _a) {
    var rejectWithValue = _a.rejectWithValue;
    return __awaiter(void 0, void 0, void 0, function () {
        var userCredential, user, error_3, authError;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, authService_1.AuthService.signInWithGoogle()];
                case 1:
                    userCredential = _b.sent();
                    return [4 /*yield*/, fetchUserData(userCredential.user.uid)];
                case 2:
                    user = _b.sent();
                    return [2 /*return*/, user];
                case 3:
                    error_3 = _b.sent();
                    authError = error_3;
                    return [2 /*return*/, rejectWithValue(authError.userMessage)];
                case 4: return [2 /*return*/];
            }
        });
    });
});
// Async thunk for Apple sign-in
exports.signInWithApple = (0, toolkit_1.createAsyncThunk)('auth/signInWithApple', function (_, _a) {
    var rejectWithValue = _a.rejectWithValue;
    return __awaiter(void 0, void 0, void 0, function () {
        var userCredential, user, error_4, authError;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, authService_1.AuthService.signInWithApple()];
                case 1:
                    userCredential = _b.sent();
                    return [4 /*yield*/, fetchUserData(userCredential.user.uid)];
                case 2:
                    user = _b.sent();
                    return [2 /*return*/, user];
                case 3:
                    error_4 = _b.sent();
                    authError = error_4;
                    return [2 /*return*/, rejectWithValue(authError.userMessage)];
                case 4: return [2 /*return*/];
            }
        });
    });
});
// Async thunk for sign-out
exports.signOut = (0, toolkit_1.createAsyncThunk)('auth/signOut', function (_, _a) {
    var rejectWithValue = _a.rejectWithValue;
    return __awaiter(void 0, void 0, void 0, function () {
        var error_5, authError;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, authService_1.AuthService.signOut()];
                case 1:
                    _b.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_5 = _b.sent();
                    authError = error_5;
                    return [2 /*return*/, rejectWithValue(authError.userMessage)];
                case 3: return [2 /*return*/];
            }
        });
    });
});
// Async thunk for refreshing session token
exports.refreshSessionToken = (0, toolkit_1.createAsyncThunk)('auth/refreshSessionToken', function (_, _a) {
    var rejectWithValue = _a.rejectWithValue;
    return __awaiter(void 0, void 0, void 0, function () {
        var token, error_6;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, authService_1.AuthService.refreshToken()];
                case 1:
                    token = _b.sent();
                    return [2 /*return*/, token];
                case 2:
                    error_6 = _b.sent();
                    return [2 /*return*/, rejectWithValue('Failed to refresh session')];
                case 3: return [2 /*return*/];
            }
        });
    });
});
// Async thunk for initializing auth state from Firebase
exports.initializeAuth = (0, toolkit_1.createAsyncThunk)('auth/initializeAuth', function (firebaseUser, _a) {
    var rejectWithValue = _a.rejectWithValue;
    return __awaiter(void 0, void 0, void 0, function () {
        var user, error_7;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    if (!firebaseUser) {
                        return [2 /*return*/, null];
                    }
                    return [4 /*yield*/, fetchUserData(firebaseUser.uid)];
                case 1:
                    user = _b.sent();
                    return [2 /*return*/, user];
                case 2:
                    error_7 = _b.sent();
                    return [2 /*return*/, rejectWithValue('Failed to initialize authentication')];
                case 3: return [2 /*return*/];
            }
        });
    });
});
// Helper function to fetch user data from Firestore
function fetchUserData(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var userDoc;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, firebase_1.firebaseFirestore)().collection('users').doc(userId).get()];
                case 1:
                    userDoc = _a.sent();
                    if (!userDoc.exists) {
                        throw new Error('User document not found');
                    }
                    return [2 /*return*/, userDoc.data()];
            }
        });
    });
}
var authSlice = (0, toolkit_1.createSlice)({
    name: 'auth',
    initialState: initialState,
    reducers: {
        setUser: function (state, action) {
            state.user = action.payload;
            state.isAuthenticated = !!action.payload;
            state.error = null;
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
        setSessionToken: function (state, action) {
            state.sessionToken = action.payload;
        },
        updateUserProfile: function (state, action) {
            if (state.user) {
                state.user = __assign(__assign({}, state.user), action.payload);
            }
        },
    },
    extraReducers: function (builder) {
        // Sign in with email
        builder
            .addCase(exports.signInWithEmail.pending, function (state) {
            state.isLoading = true;
            state.error = null;
        })
            .addCase(exports.signInWithEmail.fulfilled, function (state, action) {
            state.isLoading = false;
            state.user = action.payload;
            state.isAuthenticated = true;
            state.error = null;
        })
            .addCase(exports.signInWithEmail.rejected, function (state, action) {
            state.isLoading = false;
            state.error = action.payload || 'Sign in failed';
        });
        // Sign up with email
        builder
            .addCase(exports.signUpWithEmail.pending, function (state) {
            state.isLoading = true;
            state.error = null;
        })
            .addCase(exports.signUpWithEmail.fulfilled, function (state, action) {
            state.isLoading = false;
            state.user = action.payload;
            state.isAuthenticated = true;
            state.error = null;
        })
            .addCase(exports.signUpWithEmail.rejected, function (state, action) {
            state.isLoading = false;
            state.error = action.payload || 'Sign up failed';
        });
        // Sign in with Google
        builder
            .addCase(exports.signInWithGoogle.pending, function (state) {
            state.isLoading = true;
            state.error = null;
        })
            .addCase(exports.signInWithGoogle.fulfilled, function (state, action) {
            state.isLoading = false;
            state.user = action.payload;
            state.isAuthenticated = true;
            state.error = null;
        })
            .addCase(exports.signInWithGoogle.rejected, function (state, action) {
            state.isLoading = false;
            state.error = action.payload || 'Google sign in failed';
        });
        // Sign in with Apple
        builder
            .addCase(exports.signInWithApple.pending, function (state) {
            state.isLoading = true;
            state.error = null;
        })
            .addCase(exports.signInWithApple.fulfilled, function (state, action) {
            state.isLoading = false;
            state.user = action.payload;
            state.isAuthenticated = true;
            state.error = null;
        })
            .addCase(exports.signInWithApple.rejected, function (state, action) {
            state.isLoading = false;
            state.error = action.payload || 'Apple sign in failed';
        });
        // Sign out
        builder
            .addCase(exports.signOut.pending, function (state) {
            state.isLoading = true;
            state.error = null;
        })
            .addCase(exports.signOut.fulfilled, function (state) {
            state.isLoading = false;
            state.user = null;
            state.isAuthenticated = false;
            state.sessionToken = null;
            state.error = null;
        })
            .addCase(exports.signOut.rejected, function (state, action) {
            state.isLoading = false;
            state.error = action.payload || 'Sign out failed';
        });
        // Refresh session token
        builder
            .addCase(exports.refreshSessionToken.fulfilled, function (state, action) {
            state.sessionToken = action.payload;
        })
            .addCase(exports.refreshSessionToken.rejected, function (state) {
            state.sessionToken = null;
        });
        // Initialize auth
        builder
            .addCase(exports.initializeAuth.pending, function (state) {
            state.isInitializing = true;
        })
            .addCase(exports.initializeAuth.fulfilled, function (state, action) {
            state.isInitializing = false;
            state.user = action.payload;
            state.isAuthenticated = !!action.payload;
        })
            .addCase(exports.initializeAuth.rejected, function (state) {
            state.isInitializing = false;
            state.user = null;
            state.isAuthenticated = false;
        });
    },
});
// Selectors
var selectAuth = function (state) { return state.auth; };
exports.selectAuth = selectAuth;
var selectUser = function (state) { return state.auth.user; };
exports.selectUser = selectUser;
var selectIsAuthenticated = function (state) {
    return state.auth.isAuthenticated;
};
exports.selectIsAuthenticated = selectIsAuthenticated;
var selectIsLoading = function (state) {
    return state.auth.isLoading;
};
exports.selectIsLoading = selectIsLoading;
var selectIsInitializing = function (state) {
    return state.auth.isInitializing;
};
exports.selectIsInitializing = selectIsInitializing;
var selectAuthError = function (state) { return state.auth.error; };
exports.selectAuthError = selectAuthError;
var selectSessionToken = function (state) {
    return state.auth.sessionToken;
};
exports.selectSessionToken = selectSessionToken;
exports.setUser = (_a = authSlice.actions, _a.setUser), exports.setLoading = _a.setLoading, exports.setError = _a.setError, exports.clearError = _a.clearError, exports.setSessionToken = _a.setSessionToken, exports.updateUserProfile = _a.updateUserProfile;
exports.default = authSlice.reducer;
