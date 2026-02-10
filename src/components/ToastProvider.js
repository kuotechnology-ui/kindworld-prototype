"use strict";
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToastProvider = exports.useToast = void 0;
var react_1 = __importStar(require("react"));
var Toast_1 = require("./Toast");
var ToastContext = (0, react_1.createContext)(undefined);
var useToast = function () {
    var context = (0, react_1.useContext)(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
};
exports.useToast = useToast;
var ToastProvider = function (_a) {
    var children = _a.children;
    var _b = (0, react_1.useState)([]), toasts = _b[0], setToasts = _b[1];
    var showToast = (0, react_1.useCallback)(function (message, type, duration) {
        if (type === void 0) { type = 'info'; }
        if (duration === void 0) { duration = 3000; }
        var id = Date.now().toString();
        var newToast = { id: id, message: message, type: type, duration: duration };
        setToasts(function (prev) { return __spreadArray(__spreadArray([], prev, true), [newToast], false); });
    }, []);
    var hideToast = (0, react_1.useCallback)(function (id) {
        setToasts(function (prev) { return prev.filter(function (toast) { return toast.id !== id; }); });
    }, []);
    return (<ToastContext.Provider value={{ showToast: showToast, hideToast: hideToast }}>
      {children}
      {toasts.map(function (toast) { return (<Toast_1.Toast key={toast.id} message={toast.message} type={toast.type} duration={toast.duration} visible={true} onHide={function () { return hideToast(toast.id); }}/>); })}
    </ToastContext.Provider>);
};
exports.ToastProvider = ToastProvider;
