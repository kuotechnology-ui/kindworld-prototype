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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaderboardList = void 0;
var react_1 = __importStar(require("react"));
var react_native_1 = require("react-native");
var theme_1 = require("../theme");
var Avatar_1 = require("./Avatar");
var useAuth_1 = require("../hooks/useAuth");
var friendsService_1 = __importDefault(require("../services/friendsService"));
var LeaderboardList = function (_a) {
    var data = _a.data, _b = _a.maxItems, maxItems = _b === void 0 ? 10 : _b;
    var displayData = react_1.default.useMemo(function () { return data.slice(0, maxItems); }, [data, maxItems]);
    var LeaderboardRow = function (_a) {
        var _b, _c;
        var item = _a.item;
        var isTopThree = item.rank <= 3;
        var changeIcon = item.change > 0 ? '↑' : item.change < 0 ? '↓' : '−';
        var changeColor = item.change > 0
            ? theme_1.colors.success
            : item.change < 0
                ? theme_1.colors.error
                : theme_1.colors.textSecondary;
        var changeText = item.change > 0
            ? "up ".concat(item.change, " positions")
            : item.change < 0
                ? "down ".concat(Math.abs(item.change), " positions")
                : 'no change';
        var pointsLabel = "".concat(((_b = item.volunteerHours) !== null && _b !== void 0 ? _b : item.compassionPoints).toLocaleString(), " hrs");
        var accessibilityLabel = "Rank ".concat(item.rank, ": ").concat(item.displayName, " with ").concat(pointsLabel, ", ").concat(changeText);
        var user = (0, useAuth_1.useAuth)().user;
        var _d = (0, react_1.useState)('loading'), status = _d[0], setStatus = _d[1];
        (0, react_1.useEffect)(function () {
            var mounted = true;
            function check() {
                return __awaiter(this, void 0, void 0, function () {
                    var isF, req, e_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 3, , 4]);
                                if (!user) {
                                    if (mounted)
                                        setStatus('not_friends');
                                    return [2 /*return*/];
                                }
                                if (user.id === item.userId) {
                                    if (mounted)
                                        setStatus('friends');
                                    return [2 /*return*/];
                                }
                                return [4 /*yield*/, friendsService_1.default.isFriend(user.id, item.userId)];
                            case 1:
                                isF = _a.sent();
                                if (isF) {
                                    if (mounted)
                                        setStatus('friends');
                                    return [2 /*return*/];
                                }
                                return [4 /*yield*/, friendsService_1.default.getFriendRequestBetween(user.id, item.userId)];
                            case 2:
                                req = _a.sent();
                                if (req) {
                                    if (req.status === 'pending') {
                                        if (req.fromUserId === user.id) {
                                            if (mounted)
                                                setStatus('requested');
                                        }
                                        else {
                                            if (mounted)
                                                setStatus('incoming');
                                        }
                                    }
                                    else if (req.status === 'accepted') {
                                        if (mounted)
                                            setStatus('friends');
                                    }
                                    else {
                                        if (mounted)
                                            setStatus('not_friends');
                                    }
                                }
                                else {
                                    if (mounted)
                                        setStatus('not_friends');
                                }
                                return [3 /*break*/, 4];
                            case 3:
                                e_1 = _a.sent();
                                if (mounted)
                                    setStatus('not_friends');
                                return [3 /*break*/, 4];
                            case 4: return [2 /*return*/];
                        }
                    });
                });
            }
            check();
            return function () { mounted = false; };
        }, [item.userId, user]);
        var handleAddFriend = function () { return __awaiter(void 0, void 0, void 0, function () {
            var e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        setStatus('loading');
                        if (!user)
                            return [2 /*return*/];
                        return [4 /*yield*/, friendsService_1.default.sendFriendRequest(user.id, item.userId)];
                    case 1:
                        _a.sent();
                        setStatus('requested');
                        return [3 /*break*/, 3];
                    case 2:
                        e_2 = _a.sent();
                        setStatus('not_friends');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        var handleAccept = function () { return __awaiter(void 0, void 0, void 0, function () {
            var req, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        setStatus('loading');
                        if (!user)
                            return [2 /*return*/, setStatus('not_friends')];
                        return [4 /*yield*/, friendsService_1.default.getFriendRequestBetween(item.userId, user.id)];
                    case 1:
                        req = _a.sent();
                        if (!(req && req.id)) return [3 /*break*/, 3];
                        return [4 /*yield*/, friendsService_1.default.acceptFriendRequest(req.id)];
                    case 2:
                        _a.sent();
                        setStatus('friends');
                        return [3 /*break*/, 4];
                    case 3:
                        setStatus('not_friends');
                        _a.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        e_3 = _a.sent();
                        setStatus('not_friends');
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        }); };
        var handleRemove = function () { return __awaiter(void 0, void 0, void 0, function () {
            var e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        setStatus('loading');
                        if (!user)
                            return [2 /*return*/];
                        return [4 /*yield*/, friendsService_1.default.removeFriend(user.id, item.userId)];
                    case 1:
                        _a.sent();
                        setStatus('not_friends');
                        return [3 /*break*/, 3];
                    case 2:
                        e_4 = _a.sent();
                        setStatus('friends');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        return (<react_native_1.View style={styles.itemContainer} accessible={true} accessibilityRole="text" accessibilityLabel={accessibilityLabel}>
        {/* Rank */}
        <react_native_1.View style={[styles.rankContainer, isTopThree && styles.rankTopThree]} accessible={false}>
          <react_native_1.Text style={[styles.rankText, isTopThree && styles.rankTextTopThree]} accessible={false}>
            {item.rank}
          </react_native_1.Text>
        </react_native_1.View>

        {/* Avatar */}
        <Avatar_1.Avatar imageUrl={item.photoURL} name={item.displayName} size="small" style={styles.avatar}/>

        {/* User Info */}
        <react_native_1.View style={styles.userInfo} accessible={false}>
          <react_native_1.Text style={styles.userName} numberOfLines={1} accessible={false}>
            {item.displayName}
          </react_native_1.Text>
          <react_native_1.View style={styles.pointsContainer} accessible={false}>
            <react_native_1.Text style={styles.pointsText} accessible={false}>
              {((_c = item.volunteerHours) !== null && _c !== void 0 ? _c : item.compassionPoints).toLocaleString()} hrs
            </react_native_1.Text>
            {item.change !== 0 && (<react_native_1.Text style={[styles.changeText, { color: changeColor }]} accessible={false}>
                {changeIcon} {Math.abs(item.change)}
              </react_native_1.Text>)}
          </react_native_1.View>
        </react_native_1.View>

        {/* Medal for top 3 */}
        {isTopThree && (<react_native_1.View style={styles.medalContainer} accessible={false}>
            <react_native_1.Text style={styles.medalEmoji} accessible={false}>
              {item.rank === 1 ? '🥇' : item.rank === 2 ? '🥈' : '🥉'}
            </react_native_1.Text>
          </react_native_1.View>)}

        {/* Friend Action */}
        <react_native_1.View style={styles.friendActionContainer} accessible={false}>
          {status === 'loading' && <react_native_1.ActivityIndicator size="small" color={theme_1.colors.primary}/>}
          {status === 'not_friends' && (<react_native_1.TouchableOpacity onPress={handleAddFriend} style={styles.addButton}>
              <react_native_1.Text style={styles.addButtonText}>Add Friend</react_native_1.Text>
            </react_native_1.TouchableOpacity>)}
          {status === 'requested' && (<react_native_1.View style={styles.requestedBadge}><react_native_1.Text style={styles.requestedText}>Requested</react_native_1.Text></react_native_1.View>)}
          {status === 'incoming' && (<react_native_1.TouchableOpacity onPress={handleAccept} style={styles.addButton}>
              <react_native_1.Text style={styles.addButtonText}>Accept</react_native_1.Text>
            </react_native_1.TouchableOpacity>)}
          {status === 'friends' && (<react_native_1.TouchableOpacity onPress={handleRemove} style={styles.removeButton}>
              <react_native_1.Text style={styles.removeButtonText}>Friends</react_native_1.Text>
            </react_native_1.TouchableOpacity>)}
        </react_native_1.View>
      </react_native_1.View>);
    };
    var renderItem = react_1.default.useCallback(function (_a) {
        var item = _a.item;
        return <LeaderboardRow item={item}/>;
    }, []);
    var keyExtractor = react_1.default.useCallback(function (item) { return item.userId; }, []);
    var renderEmptyState = react_1.default.useCallback(function () { return (<react_native_1.View style={styles.emptyContainer}>
      <react_native_1.Text style={styles.emptyText}>No leaderboard data available</react_native_1.Text>
    </react_native_1.View>); }, []);
    var ItemSeparator = react_1.default.useCallback(function () { return <react_native_1.View style={styles.separator}/>; }, []);
    return (<react_native_1.View style={styles.container}>
      <react_native_1.FlatList data={displayData} renderItem={renderItem} keyExtractor={keyExtractor} scrollEnabled={false} ListEmptyComponent={renderEmptyState} ItemSeparatorComponent={ItemSeparator} showsVerticalScrollIndicator={false} removeClippedSubviews={true} maxToRenderPerBatch={10} windowSize={5} initialNumToRender={10} getItemLayout={function (_, index) { return ({
            length: 56,
            offset: 56 * index,
            index: index,
        }); }}/>
    </react_native_1.View>);
};
exports.LeaderboardList = LeaderboardList;
var styles = react_native_1.StyleSheet.create({
    container: {
        backgroundColor: theme_1.colors.white,
        borderRadius: theme_1.borderRadius.lg,
        padding: theme_1.spacing.md,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: theme_1.spacing.sm,
    },
    rankContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: theme_1.colors.gray100,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: theme_1.spacing.sm,
    },
    rankTopThree: {
        backgroundColor: theme_1.colors.accent,
    },
    rankText: __assign(__assign({}, theme_1.typography.body2), { fontWeight: '600', color: theme_1.colors.textSecondary }),
    rankTextTopThree: {
        color: theme_1.colors.white,
    },
    avatar: {
        marginRight: theme_1.spacing.sm,
    },
    userInfo: {
        flex: 1,
    },
    userName: __assign(__assign({}, theme_1.typography.body1), { fontWeight: '500', color: theme_1.colors.textPrimary, marginBottom: 2 }),
    pointsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    pointsText: __assign(__assign({}, theme_1.typography.body2), { color: theme_1.colors.textSecondary, marginRight: theme_1.spacing.xs }),
    changeText: __assign(__assign({}, theme_1.typography.caption), { fontWeight: '600' }),
    medalContainer: {
        marginLeft: theme_1.spacing.xs,
    },
    medalEmoji: {
        fontSize: 20,
    },
    separator: {
        height: 1,
        backgroundColor: theme_1.colors.gray200,
        marginVertical: theme_1.spacing.xs,
    },
    emptyContainer: {
        paddingVertical: theme_1.spacing.xl,
        alignItems: 'center',
    },
    emptyText: __assign(__assign({}, theme_1.typography.body2), { color: theme_1.colors.textSecondary }),
    friendActionContainer: {
        marginLeft: theme_1.spacing.sm,
    },
    addButton: {
        backgroundColor: theme_1.colors.primary,
        paddingHorizontal: theme_1.spacing.sm,
        paddingVertical: theme_1.spacing.xs,
        borderRadius: theme_1.borderRadius.md,
    },
    addButtonText: {
        color: theme_1.colors.white,
        fontWeight: '600',
    },
    removeButton: {
        backgroundColor: theme_1.colors.gray100,
        paddingHorizontal: theme_1.spacing.sm,
        paddingVertical: theme_1.spacing.xs,
        borderRadius: theme_1.borderRadius.md,
    },
    removeButtonText: {
        color: theme_1.colors.textSecondary,
        fontWeight: '600',
    },
    requestedBadge: {
        backgroundColor: theme_1.colors.gray100,
        paddingHorizontal: theme_1.spacing.sm,
        paddingVertical: theme_1.spacing.xs,
        borderRadius: theme_1.borderRadius.md,
    },
    requestedText: {
        color: theme_1.colors.textSecondary,
        fontWeight: '600',
    },
});
