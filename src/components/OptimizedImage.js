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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptimizedImage = void 0;
var react_1 = __importStar(require("react"));
var react_native_1 = require("react-native");
var theme_1 = require("../theme");
/**
 * OptimizedImage component with progressive loading and caching
 * Features:
 * - Progressive image loading with placeholder
 * - Loading indicator
 * - Error handling with fallback
 * - Automatic cache control headers
 */
var OptimizedImage = function (_a) {
    var source = _a.source, style = _a.style, _b = _a.placeholderColor, placeholderColor = _b === void 0 ? theme_1.colors.gray200 : _b, _c = _a.showLoadingIndicator, showLoadingIndicator = _c === void 0 ? true : _c, _d = _a.cachePolicy, cachePolicy = _d === void 0 ? 'memory-disk' : _d, props = __rest(_a, ["source", "style", "placeholderColor", "showLoadingIndicator", "cachePolicy"]);
    var _e = (0, react_1.useState)(true), isLoading = _e[0], setIsLoading = _e[1];
    var _f = (0, react_1.useState)(false), hasError = _f[0], setHasError = _f[1];
    var handleLoadStart = (0, react_1.useCallback)(function () {
        setIsLoading(true);
        setHasError(false);
    }, []);
    var handleLoadEnd = (0, react_1.useCallback)(function () {
        setIsLoading(false);
    }, []);
    var handleError = (0, react_1.useCallback)(function () {
        setIsLoading(false);
        setHasError(true);
    }, []);
    // Prepare image source with cache control
    var imageSource = typeof source === 'string'
        ? {
            uri: source,
            cache: cachePolicy === 'memory' ? 'default' : 'force-cache',
        }
        : __assign(__assign({}, source), { cache: source.cache || (cachePolicy === 'memory' ? 'default' : 'force-cache') });
    return (<react_native_1.View style={[styles.container, style]}>
      {/* Placeholder background */}
      <react_native_1.View style={[
            react_native_1.StyleSheet.absoluteFill,
            { backgroundColor: placeholderColor },
        ]}/>

      {/* Image */}
      {!hasError && (<react_native_1.Image {...props} source={imageSource} style={[react_native_1.StyleSheet.absoluteFill, style]} onLoadStart={handleLoadStart} onLoadEnd={handleLoadEnd} onError={handleError} resizeMode={props.resizeMode || 'cover'}/>)}

      {/* Loading indicator */}
      {isLoading && showLoadingIndicator && (<react_native_1.View style={styles.loadingContainer}>
          <react_native_1.ActivityIndicator size="small" color={theme_1.colors.accent}/>
        </react_native_1.View>)}

      {/* Error fallback */}
      {hasError && (<react_native_1.View style={styles.errorContainer}>
          <react_native_1.View style={styles.errorIcon}>
            <react_native_1.View style={styles.errorIconBar}/>
            <react_native_1.View style={[styles.errorIconBar, styles.errorIconBarRotated]}/>
          </react_native_1.View>
        </react_native_1.View>)}
    </react_native_1.View>);
};
exports.OptimizedImage = OptimizedImage;
var styles = react_native_1.StyleSheet.create({
    container: {
        overflow: 'hidden',
    },
    loadingContainer: __assign(__assign({}, react_native_1.StyleSheet.absoluteFillObject), { justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent' }),
    errorContainer: __assign(__assign({}, react_native_1.StyleSheet.absoluteFillObject), { justifyContent: 'center', alignItems: 'center', backgroundColor: theme_1.colors.gray100 }),
    errorIcon: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorIconBar: {
        position: 'absolute',
        width: 24,
        height: 2,
        backgroundColor: theme_1.colors.gray400,
        transform: [{ rotate: '45deg' }],
    },
    errorIconBarRotated: {
        transform: [{ rotate: '-45deg' }],
    },
});
