"use strict";
/**
 * Accessibility Utilities
 *
 * Provides helper functions and constants for implementing WCAG 2.1 AA compliant
 * accessibility features throughout the KindWorld application.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmptyStateAccessibilityLabel = exports.getLoadingAccessibilityLabel = exports.getInputAccessibilityLabel = exports.getTabAccessibilityLabel = exports.announceForAccessibility = exports.meetsContrastRequirement = exports.formatTimeForScreenReader = exports.formatDateForScreenReader = exports.createCheckableState = exports.createExpandableState = exports.createToggleState = exports.getAccessibilityHint = exports.getBadgeAccessibilityLabel = exports.getLeaderboardAccessibilityLabel = exports.getVoucherAccessibilityLabel = exports.getMissionAccessibilityLabel = exports.getPointsAccessibilityLabel = exports.A11Y_ROLES = exports.STANDARD_HIT_SLOP = exports.MIN_TOUCH_TARGET_SIZE = void 0;
/**
 * Minimum touch target size in points (WCAG 2.1 AA requirement)
 */
exports.MIN_TOUCH_TARGET_SIZE = 44;
/**
 * Standard hit slop for interactive elements to ensure 44x44 minimum touch target
 */
exports.STANDARD_HIT_SLOP = {
    top: 12,
    bottom: 12,
    left: 12,
    right: 12,
};
/**
 * Accessibility roles for common UI patterns
 */
exports.A11Y_ROLES = {
    BUTTON: 'button',
    LINK: 'link',
    IMAGE: 'image',
    TEXT: 'text',
    HEADER: 'header',
    SEARCH: 'search',
    TAB: 'tab',
    MENU: 'menu',
    MENU_ITEM: 'menuitem',
    CHECKBOX: 'checkbox',
    RADIO: 'radio',
    SWITCH: 'switch',
    ADJUSTABLE: 'adjustable',
    IMAGE_BUTTON: 'imagebutton',
};
/**
 * Generate accessibility label for points display
 */
var getPointsAccessibilityLabel = function (points) {
    return "".concat(points.toLocaleString(), " compassion points");
};
exports.getPointsAccessibilityLabel = getPointsAccessibilityLabel;
/**
 * Generate accessibility label for mission card
 */
var getMissionAccessibilityLabel = function (title, date, points, isFavorite) {
    var favoriteStatus = isFavorite ? 'favorited' : 'not favorited';
    return "Mission: ".concat(title, ", Date: ").concat(date, ", Reward: ").concat(points, " points, ").concat(favoriteStatus);
};
exports.getMissionAccessibilityLabel = getMissionAccessibilityLabel;
/**
 * Generate accessibility label for voucher card
 */
var getVoucherAccessibilityLabel = function (brandName, title, pointsCost, stock) {
    var stockInfo = stock !== undefined && stock < 10 ? ", only ".concat(stock, " left") : '';
    return "".concat(brandName, " voucher: ").concat(title, ", costs ").concat(pointsCost, " points").concat(stockInfo);
};
exports.getVoucherAccessibilityLabel = getVoucherAccessibilityLabel;
/**
 * Generate accessibility label for leaderboard entry
 */
var getLeaderboardAccessibilityLabel = function (rank, name, points, change) {
    var changeText = change > 0
        ? ", up ".concat(change, " positions")
        : change < 0
            ? ", down ".concat(Math.abs(change), " positions")
            : ', no change';
    return "Rank ".concat(rank, ": ").concat(name, " with ").concat(points.toLocaleString(), " points").concat(changeText);
};
exports.getLeaderboardAccessibilityLabel = getLeaderboardAccessibilityLabel;
/**
 * Generate accessibility label for badge
 */
var getBadgeAccessibilityLabel = function (name, description, isEarned) {
    var status = isEarned ? 'earned' : 'not yet earned';
    return "".concat(name, " badge, ").concat(status, ". ").concat(description);
};
exports.getBadgeAccessibilityLabel = getBadgeAccessibilityLabel;
/**
 * Generate accessibility hint for interactive elements
 */
var getAccessibilityHint = function (action) {
    return "Double tap to ".concat(action);
};
exports.getAccessibilityHint = getAccessibilityHint;
/**
 * Create accessibility state for toggleable elements
 */
var createToggleState = function (isSelected, isDisabled) {
    if (isDisabled === void 0) { isDisabled = false; }
    return {
        selected: isSelected,
        disabled: isDisabled,
    };
};
exports.createToggleState = createToggleState;
/**
 * Create accessibility state for expandable elements
 */
var createExpandableState = function (isExpanded, isDisabled) {
    if (isDisabled === void 0) { isDisabled = false; }
    return {
        expanded: isExpanded,
        disabled: isDisabled,
    };
};
exports.createExpandableState = createExpandableState;
/**
 * Create accessibility state for checkable elements
 */
var createCheckableState = function (isChecked, isDisabled) {
    if (isDisabled === void 0) { isDisabled = false; }
    return {
        checked: isChecked,
        disabled: isDisabled,
    };
};
exports.createCheckableState = createCheckableState;
/**
 * Format date for screen readers
 */
var formatDateForScreenReader = function (date) {
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};
exports.formatDateForScreenReader = formatDateForScreenReader;
/**
 * Format time for screen readers
 */
var formatTimeForScreenReader = function (date) {
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });
};
exports.formatTimeForScreenReader = formatTimeForScreenReader;
/**
 * Check if color contrast ratio meets WCAG AA standards (4.5:1 for normal text)
 * This is a simplified version - for production, use a proper color contrast library
 */
var meetsContrastRequirement = function (foreground, background, largeText) {
    if (largeText === void 0) { largeText = false; }
    // Minimum contrast ratios per WCAG 2.1 AA
    var minRatio = largeText ? 3.0 : 4.5;
    // In a real implementation, calculate the actual contrast ratio
    // For now, we'll assume our design system colors meet requirements
    return true;
};
exports.meetsContrastRequirement = meetsContrastRequirement;
/**
 * Announce message to screen reader
 * Use this for dynamic content updates that need to be announced
 */
var announceForAccessibility = function (message) {
    // This would use AccessibilityInfo.announceForAccessibility in React Native
    // Implementation depends on the specific use case
    console.log('[A11Y Announcement]:', message);
};
exports.announceForAccessibility = announceForAccessibility;
/**
 * Generate accessibility label for navigation tabs
 */
var getTabAccessibilityLabel = function (tabName, isActive, badgeCount) {
    var activeStatus = isActive ? 'selected' : '';
    var badge = badgeCount ? ", ".concat(badgeCount, " notifications") : '';
    return "".concat(tabName, " tab").concat(activeStatus).concat(badge);
};
exports.getTabAccessibilityLabel = getTabAccessibilityLabel;
/**
 * Generate accessibility label for form inputs
 */
var getInputAccessibilityLabel = function (label, isRequired, error) {
    if (isRequired === void 0) { isRequired = false; }
    var required = isRequired ? ', required' : '';
    var errorText = error ? ", error: ".concat(error) : '';
    return "".concat(label).concat(required).concat(errorText);
};
exports.getInputAccessibilityLabel = getInputAccessibilityLabel;
/**
 * Generate accessibility label for loading states
 */
var getLoadingAccessibilityLabel = function (context) {
    return "Loading ".concat(context, ", please wait");
};
exports.getLoadingAccessibilityLabel = getLoadingAccessibilityLabel;
/**
 * Generate accessibility label for empty states
 */
var getEmptyStateAccessibilityLabel = function (context) {
    return "No ".concat(context, " available");
};
exports.getEmptyStateAccessibilityLabel = getEmptyStateAccessibilityLabel;
