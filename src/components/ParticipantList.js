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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParticipantList = void 0;
var react_1 = __importDefault(require("react"));
var react_native_1 = require("react-native");
var _1 = require("./");
var theme_1 = require("../theme");
var ParticipantList = function (_a) {
    var participants = _a.participants, onParticipantPress = _a.onParticipantPress, _b = _a.loading, loading = _b === void 0 ? false : _b;
    var getStatusColor = function (status) {
        switch (status) {
            case 'completed':
                return theme_1.colors.success;
            case 'joined':
                return theme_1.colors.info;
            case 'cancelled':
                return theme_1.colors.error;
            default:
                return theme_1.colors.gray500;
        }
    };
    var getStatusLabel = function (status) {
        switch (status) {
            case 'completed':
                return 'Completed';
            case 'joined':
                return 'Joined';
            case 'cancelled':
                return 'Cancelled';
            default:
                return status;
        }
    };
    var renderParticipant = function (_a) {
        var item = _a.item;
        return (<react_native_1.TouchableOpacity onPress={function () { return onParticipantPress === null || onParticipantPress === void 0 ? void 0 : onParticipantPress(item); }} disabled={!onParticipantPress} activeOpacity={0.7}>
      <_1.Card style={styles.participantCard}>
        <react_native_1.View style={styles.participantContent}>
          <_1.Avatar uri={item.photoURL} name={item.displayName} size={48}/>
          <react_native_1.View style={styles.participantInfo}>
            <react_native_1.Text style={styles.participantName}>{item.displayName}</react_native_1.Text>
            <react_native_1.Text style={styles.participantDate}>
              Joined: {item.joinedAt.toLocaleDateString()}
            </react_native_1.Text>
            {item.completedAt && (<react_native_1.Text style={styles.participantDate}>
                Completed: {item.completedAt.toLocaleDateString()}
              </react_native_1.Text>)}
          </react_native_1.View>
          <react_native_1.View style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(item.status) },
            ]}>
            <react_native_1.Text style={styles.statusText}>{getStatusLabel(item.status)}</react_native_1.Text>
          </react_native_1.View>
        </react_native_1.View>
      </_1.Card>
    </react_native_1.TouchableOpacity>);
    };
    var renderEmptyState = function () { return (<react_native_1.View style={styles.emptyState}>
      <react_native_1.Text style={styles.emptyStateText}>No participants yet</react_native_1.Text>
    </react_native_1.View>); };
    return (<react_native_1.FlatList data={participants} renderItem={renderParticipant} keyExtractor={function (item) { return item.userId; }} ListEmptyComponent={renderEmptyState} contentContainerStyle={styles.listContent}/>);
};
exports.ParticipantList = ParticipantList;
var styles = react_native_1.StyleSheet.create({
    listContent: {
        padding: theme_1.spacing.md,
    },
    participantCard: {
        marginBottom: theme_1.spacing.md,
        padding: theme_1.spacing.md,
    },
    participantContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    participantInfo: {
        flex: 1,
        marginLeft: theme_1.spacing.md,
    },
    participantName: __assign(__assign({}, theme_1.typography.body1), { color: theme_1.colors.textPrimary, fontWeight: '600', marginBottom: theme_1.spacing.xs / 2 }),
    participantDate: __assign(__assign({}, theme_1.typography.caption), { color: theme_1.colors.textSecondary }),
    statusBadge: {
        paddingHorizontal: theme_1.spacing.sm,
        paddingVertical: theme_1.spacing.xs / 2,
        borderRadius: 12,
    },
    statusText: __assign(__assign({}, theme_1.typography.caption), { color: theme_1.colors.white, fontWeight: '600' }),
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: theme_1.spacing.xxl,
    },
    emptyStateText: __assign(__assign({}, theme_1.typography.body1), { color: theme_1.colors.textSecondary }),
});
