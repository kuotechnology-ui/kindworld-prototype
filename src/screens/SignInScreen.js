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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
exports.SignInScreen = void 0;
var react_1 = __importStar(require("react"));
var react_native_1 = require("react-native");
var components_1 = require("../components");
var theme_1 = require("../theme");
var useAuth_1 = require("../hooks/useAuth");
var monitoringService_1 = require("../services/monitoringService");
var SignInScreen = function () {
    var _a = (0, react_1.useState)(''), email = _a[0], setEmail = _a[1];
    var _b = (0, react_1.useState)(''), password = _b[0], setPassword = _b[1];
    var _c = (0, react_1.useState)(''), emailError = _c[0], setEmailError = _c[1];
    var _d = (0, react_1.useState)(''), passwordError = _d[0], setPasswordError = _d[1];
    var _e = (0, react_1.useState)(true), isSignUp = _e[0], setIsSignUp = _e[1];
    var _f = (0, react_1.useState)(false), showPassword = _f[0], setShowPassword = _f[1];
    var emailInputRef = (0, react_1.useRef)(null);
    var passwordInputRef = (0, react_1.useRef)(null);
    var _g = (0, useAuth_1.useAuth)(), signInWithEmail = _g.signInWithEmail, signUpWithEmail = _g.signUpWithEmail, signInWithGoogle = _g.signInWithGoogle, signInWithApple = _g.signInWithApple, isLoading = _g.isLoading, error = _g.error, clearAuthError = _g.clearAuthError;
    // Auto-focus on email input when screen loads
    (0, react_1.useEffect)(function () {
        var timer = setTimeout(function () {
            var _a;
            (_a = emailInputRef.current) === null || _a === void 0 ? void 0 : _a.focus();
        }, 100);
        return function () { return clearTimeout(timer); };
    }, []);
    // Clear error when user starts typing
    (0, react_1.useEffect)(function () {
        if (error) {
            clearAuthError();
        }
    }, [email, password]);
    var validateEmail = function (emailValue) {
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailValue.trim()) {
            setEmailError('Email is required');
            return false;
        }
        if (!emailRegex.test(emailValue)) {
            setEmailError('Please enter a valid email address');
            return false;
        }
        setEmailError('');
        return true;
    };
    var validatePassword = function (passwordValue) {
        if (!passwordValue) {
            setPasswordError('Password is required');
            return false;
        }
        if (passwordValue.length < 8) {
            setPasswordError('Password must be at least 8 characters');
            return false;
        }
        setPasswordError('');
        return true;
    };
    var handleContinueWithEmail = function () { return __awaiter(void 0, void 0, void 0, function () {
        var isEmailValid, isPasswordValid, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    isEmailValid = validateEmail(email);
                    isPasswordValid = validatePassword(password);
                    if (!isEmailValid || !isPasswordValid) {
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 8, , 9]);
                    if (!isSignUp) return [3 /*break*/, 4];
                    return [4 /*yield*/, signUpWithEmail(email, password)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, monitoringService_1.monitoringService.logSignUp('email')];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 4: return [4 /*yield*/, signInWithEmail(email, password)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, monitoringService_1.monitoringService.logSignIn('email')];
                case 6:
                    _a.sent();
                    _a.label = 7;
                case 7: return [3 /*break*/, 9];
                case 8:
                    err_1 = _a.sent();
                    // Error is handled by Redux and displayed via error state
                    console.error('Email auth error:', err_1);
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    }); };
    var handleGoogleSignIn = function () { return __awaiter(void 0, void 0, void 0, function () {
        var err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, signInWithGoogle()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, monitoringService_1.monitoringService.logSignIn('google')];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_2 = _a.sent();
                    console.error('Google sign-in error:', err_2);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleAppleSignIn = function () { return __awaiter(void 0, void 0, void 0, function () {
        var err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, signInWithApple()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, monitoringService_1.monitoringService.logSignIn('apple')];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_3 = _a.sent();
                    console.error('Apple sign-in error:', err_3);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    return (<react_native_1.KeyboardAvoidingView style={styles.container} behavior={react_native_1.Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={react_native_1.Platform.OS === 'ios' ? 0 : 20}>
      <react_native_1.ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {/* Logo Section */}
        <react_native_1.View style={styles.logoContainer} accessible={true} accessibilityRole="image" accessibilityLabel="KindWorld logo">
          <react_native_1.View style={styles.logoPlaceholder}>
            <react_native_1.Text style={styles.logoText} accessible={false}>
              KindWorld
            </react_native_1.Text>
          </react_native_1.View>
        </react_native_1.View>

        {/* Header Section */}
        <react_native_1.View style={styles.headerContainer}>
          <react_native_1.Text style={styles.title} accessible={true} accessibilityRole="header">
            {isSignUp ? 'Create an account' : 'Welcome back'}
          </react_native_1.Text>
          <react_native_1.Text style={styles.subtitle} accessible={true} accessibilityRole="text">
            {isSignUp
            ? 'Enter your email to sign up for this app'
            : 'Sign in to continue to KindWorld'}
          </react_native_1.Text>
        </react_native_1.View>

        {/* Email Input Section */}
        <react_native_1.View style={styles.formContainer}>
          <components_1.Input ref={emailInputRef} placeholder="name@example.com" value={email} onChangeText={setEmail} error={emailError} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} autoComplete="email" textContentType="emailAddress" returnKeyType="next" onSubmitEditing={function () { var _a; return (_a = passwordInputRef.current) === null || _a === void 0 ? void 0 : _a.focus(); }} accessibilityLabel="Email address" required={true}/>

          <react_native_1.View style={styles.passwordContainer}>
            <components_1.Input ref={passwordInputRef} placeholder="Password (min 8 characters)" value={password} onChangeText={setPassword} error={passwordError || (error ? error.userMessage : '')} secureTextEntry={!showPassword} autoCapitalize="none" autoCorrect={false} autoComplete={isSignUp ? 'new-password' : 'password'} textContentType={isSignUp ? 'newPassword' : 'password'} returnKeyType="done" onSubmitEditing={handleContinueWithEmail} accessibilityLabel="Password" required={true}/>
            <react_native_1.TouchableOpacity style={styles.passwordToggle} onPress={function () { return setShowPassword(!showPassword); }} accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}>
              <react_native_1.Text style={styles.passwordToggleText}>
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </react_native_1.Text>
            </react_native_1.TouchableOpacity>
          </react_native_1.View>

          <components_1.Button title={isSignUp ? 'Sign Up' : 'Sign In'} onPress={handleContinueWithEmail} variant="primary" loading={isLoading} disabled={isLoading} style={styles.continueButton} accessibilityLabel={isSignUp ? 'Sign up with email' : 'Sign in with email'} accessibilityHint={isSignUp ? 'Create your account' : 'Sign in to your account'}/>

          {/* Toggle between Sign In and Sign Up */}
          <react_native_1.TouchableOpacity style={styles.toggleAuthMode} onPress={function () {
            setIsSignUp(!isSignUp);
            setEmailError('');
            setPasswordError('');
        }}>
            <react_native_1.Text style={styles.toggleAuthText}>
              {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
              <react_native_1.Text style={styles.toggleAuthLink}>
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </react_native_1.Text>
            </react_native_1.Text>
          </react_native_1.TouchableOpacity>
        </react_native_1.View>

        {/* Divider */}
        <react_native_1.View style={styles.dividerContainer}>
          <react_native_1.View style={styles.dividerLine}/>
          <react_native_1.Text style={styles.dividerText}>or</react_native_1.Text>
          <react_native_1.View style={styles.dividerLine}/>
        </react_native_1.View>

        {/* Social Sign-In Buttons */}
        <react_native_1.View style={styles.socialButtonsContainer}>
          <react_native_1.TouchableOpacity style={styles.socialButton} onPress={handleGoogleSignIn} disabled={isLoading} activeOpacity={0.7} accessible={true} accessibilityRole="button" accessibilityLabel="Continue with Google" accessibilityHint="Sign in using your Google account" accessibilityState={{ disabled: isLoading }}>
            <react_native_1.View style={styles.socialButtonContent}>
              <react_native_1.View style={styles.socialIconPlaceholder}>
                <react_native_1.Text style={styles.socialIconText} accessible={false}>G</react_native_1.Text>
              </react_native_1.View>
              <react_native_1.Text style={styles.socialButtonText} accessible={false}>
                Continue with Google
              </react_native_1.Text>
            </react_native_1.View>
          </react_native_1.TouchableOpacity>

          {react_native_1.Platform.OS === 'ios' && (<react_native_1.TouchableOpacity style={styles.socialButton} onPress={handleAppleSignIn} disabled={isLoading} activeOpacity={0.7} accessible={true} accessibilityRole="button" accessibilityLabel="Continue with Apple" accessibilityHint="Sign in using your Apple ID" accessibilityState={{ disabled: isLoading }}>
              <react_native_1.View style={styles.socialButtonContent}>
                <react_native_1.View style={styles.socialIconPlaceholder}>
                  <react_native_1.Text style={styles.socialIconText} accessible={false}>🍎</react_native_1.Text>
                </react_native_1.View>
                <react_native_1.Text style={styles.socialButtonText} accessible={false}>
                  Continue with Apple
                </react_native_1.Text>
              </react_native_1.View>
            </react_native_1.TouchableOpacity>)}
        </react_native_1.View>

        {/* Footer */}
        <react_native_1.View style={styles.footer}>
          <react_native_1.Text style={styles.footerText}>
            By continuing, you agree to our{' '}
            <react_native_1.Text style={styles.footerLink}>Terms of Service</react_native_1.Text> and{' '}
            <react_native_1.Text style={styles.footerLink}>Privacy Policy</react_native_1.Text>
          </react_native_1.Text>
        </react_native_1.View>
      </react_native_1.ScrollView>
    </react_native_1.KeyboardAvoidingView>);
};
exports.SignInScreen = SignInScreen;
var styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme_1.colors.white,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: theme_1.spacing.lg,
        paddingTop: theme_1.spacing.xxl,
        paddingBottom: theme_1.spacing.xl,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: theme_1.spacing.xl,
    },
    logoPlaceholder: {
        width: 80,
        height: 80,
        borderRadius: theme_1.borderRadius.lg,
        backgroundColor: theme_1.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoText: __assign(__assign({}, theme_1.typography.h3), { color: theme_1.colors.white, fontWeight: '700' }),
    headerContainer: {
        marginBottom: theme_1.spacing.xl,
    },
    title: __assign(__assign({}, theme_1.typography.h1), { color: theme_1.colors.textPrimary, marginBottom: theme_1.spacing.sm, textAlign: 'center' }),
    subtitle: __assign(__assign({}, theme_1.typography.body1), { color: theme_1.colors.textSecondary, textAlign: 'center' }),
    formContainer: {
        marginBottom: theme_1.spacing.lg,
    },
    passwordContainer: {
        position: 'relative',
    },
    passwordToggle: {
        position: 'absolute',
        right: theme_1.spacing.md,
        top: 14,
        padding: theme_1.spacing.xs,
    },
    passwordToggleText: {
        fontSize: 18,
    },
    continueButton: {
        marginTop: theme_1.spacing.sm,
    },
    toggleAuthMode: {
        alignItems: 'center',
        marginTop: theme_1.spacing.md,
        paddingVertical: theme_1.spacing.sm,
    },
    toggleAuthText: __assign(__assign({}, theme_1.typography.body2), { color: theme_1.colors.textSecondary }),
    toggleAuthLink: {
        color: theme_1.colors.accent,
        fontWeight: '600',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: theme_1.spacing.lg,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: theme_1.colors.gray300,
    },
    dividerText: __assign(__assign({}, theme_1.typography.body2), { color: theme_1.colors.textSecondary, marginHorizontal: theme_1.spacing.md }),
    socialButtonsContainer: {
        marginBottom: theme_1.spacing.xl,
    },
    socialButton: {
        backgroundColor: theme_1.colors.white,
        borderWidth: 1,
        borderColor: theme_1.colors.gray300,
        borderRadius: theme_1.borderRadius.md,
        paddingVertical: theme_1.spacing.md,
        paddingHorizontal: theme_1.spacing.md,
        marginBottom: theme_1.spacing.md,
        minHeight: 44, // WCAG 2.1 AA compliant touch target
    },
    socialButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    socialIconPlaceholder: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: theme_1.colors.gray200,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: theme_1.spacing.sm,
    },
    socialIconText: {
        fontSize: 14,
        fontWeight: '600',
    },
    socialButtonText: __assign(__assign({}, theme_1.typography.button), { color: theme_1.colors.textPrimary }),
    footer: {
        marginTop: 'auto',
        paddingTop: theme_1.spacing.lg,
    },
    footerText: __assign(__assign({}, theme_1.typography.caption), { color: theme_1.colors.textSecondary, textAlign: 'center', lineHeight: 18 }),
    footerLink: {
        color: theme_1.colors.accent,
        fontWeight: '600',
    },
});
