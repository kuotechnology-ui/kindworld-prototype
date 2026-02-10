"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.firebasePerf = exports.firebaseCrashlytics = exports.firebaseAnalytics = exports.firebaseStorage = exports.firebaseFirestore = exports.firebaseAuth = void 0;
var auth_1 = __importDefault(require("@react-native-firebase/auth"));
var firestore_1 = __importDefault(require("@react-native-firebase/firestore"));
var storage_1 = __importDefault(require("@react-native-firebase/storage"));
var analytics_1 = __importDefault(require("@react-native-firebase/analytics"));
var crashlytics_1 = __importDefault(require("@react-native-firebase/crashlytics"));
var perf_1 = __importDefault(require("@react-native-firebase/perf"));
var google_signin_1 = require("@react-native-google-signin/google-signin");
// Initialize Google Sign-In
// Note: GOOGLE_WEB_CLIENT_ID should be set in your .env file
// Get it from Firebase Console > Authentication > Sign-in method > Google
var GOOGLE_WEB_CLIENT_ID = process.env.GOOGLE_WEB_CLIENT_ID || '';
if (GOOGLE_WEB_CLIENT_ID) {
    google_signin_1.GoogleSignin.configure({
        webClientId: GOOGLE_WEB_CLIENT_ID,
        offlineAccess: true,
    });
}
exports.firebaseAuth = auth_1.default;
exports.firebaseFirestore = firestore_1.default;
exports.firebaseStorage = storage_1.default;
exports.firebaseAnalytics = analytics_1.default;
exports.firebaseCrashlytics = crashlytics_1.default;
exports.firebasePerf = perf_1.default;
exports.default = {
    auth: auth_1.default,
    firestore: firestore_1.default,
    storage: storage_1.default,
    analytics: analytics_1.default,
    crashlytics: crashlytics_1.default,
    perf: perf_1.default,
};
