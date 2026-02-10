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
exports.MissionPerformanceTable = void 0;
var react_1 = __importStar(require("react"));
var react_native_1 = require("react-native");
var theme_1 = require("../theme");
var MissionPerformanceTable = function (_a) {
    var missions = _a.missions, onMissionPress = _a.onMissionPress;
    var _b = (0, react_1.useState)(null), selectedMission = _b[0], setSelectedMission = _b[1];
    var _c = (0, react_1.useState)('date'), sortBy = _c[0], setSortBy = _c[1];
    var _d = (0, react_1.useState)('desc'), sortOrder = _d[0], setSortOrder = _d[1];
    var handleSort = function (field) {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        }
        else {
            setSortBy(field);
            setSortOrder('desc');
        }
    };
    var sortedMissions = __spreadArray([], missions, true).sort(function (a, b) {
        var comparison = 0;
        switch (sortBy) {
            case 'date':
                comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
                break;
            case 'participants':
                comparison = a.participants - b.participants;
                break;
            case 'points':
                comparison = a.pointsDistributed - b.pointsDistributed;
                break;
            case 'engagement':
                comparison = a.engagementScore - b.engagementScore;
                break;
        }
        return sortOrder === 'asc' ? comparison : -comparison;
    });
    var handleMissionPress = function (mission) {
        setSelectedMission(mission);
        onMissionPress === null || onMissionPress === void 0 ? void 0 : onMissionPress(mission);
    };
    var renderMissionRow = function (_a) {
        var item = _a.item;
        return (<react_native_1.TouchableOpacity style={styles.missionRow} onPress={function () { return handleMissionPress(item); }} activeOpacity={0.7}>
      <react_native_1.View style={styles.missionMainInfo}>
        <react_native_1.Text style={styles.missionTitle} numberOfLines={2}>
          {item.title}
        </react_native_1.Text>
        <react_native_1.Text style={styles.missionDate}>{item.date}</react_native_1.Text>
      </react_native_1.View>
      
      <react_native_1.View style={styles.missionMetrics}>
        <react_native_1.View style={styles.metricItem}>
          <react_native_1.Text style={styles.metricLabel}>Participants</react_native_1.Text>
          <react_native_1.Text style={styles.metricValue}>{item.participants}</react_native_1.Text>
        </react_native_1.View>
        
        <react_native_1.View style={styles.metricItem}>
          <react_native_1.Text style={styles.metricLabel}>Points</react_native_1.Text>
          <react_native_1.Text style={styles.metricValue}>{item.pointsDistributed}</react_native_1.Text>
        </react_native_1.View>
        
        <react_native_1.View style={styles.metricItem}>
          <react_native_1.Text style={styles.metricLabel}>Completion</react_native_1.Text>
          <react_native_1.Text style={styles.metricValue}>{item.completionRate}%</react_native_1.Text>
        </react_native_1.View>
        
        <react_native_1.View style={styles.metricItem}>
          <react_native_1.Text style={styles.metricLabel}>Engagement</react_native_1.Text>
          <react_native_1.View style={styles.engagementBadge}>
            <react_native_1.Text style={styles.engagementText}>
              {item.engagementScore.toFixed(1)}
            </react_native_1.Text>
          </react_native_1.View>
        </react_native_1.View>
      </react_native_1.View>
    </react_native_1.TouchableOpacity>);
    };
    return (<react_native_1.View style={styles.container}>
      {/* Sort Controls */}
      <react_native_1.View style={styles.sortControls}>
        <react_native_1.TouchableOpacity style={[styles.sortButton, sortBy === 'date' && styles.sortButtonActive]} onPress={function () { return handleSort('date'); }}>
          <react_native_1.Text style={[styles.sortButtonText, sortBy === 'date' && styles.sortButtonTextActive]}>
            Date {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
          </react_native_1.Text>
        </react_native_1.TouchableOpacity>
        
        <react_native_1.TouchableOpacity style={[styles.sortButton, sortBy === 'participants' && styles.sortButtonActive]} onPress={function () { return handleSort('participants'); }}>
          <react_native_1.Text style={[styles.sortButtonText, sortBy === 'participants' && styles.sortButtonTextActive]}>
            Participants {sortBy === 'participants' && (sortOrder === 'asc' ? '↑' : '↓')}
          </react_native_1.Text>
        </react_native_1.TouchableOpacity>
        
        <react_native_1.TouchableOpacity style={[styles.sortButton, sortBy === 'engagement' && styles.sortButtonActive]} onPress={function () { return handleSort('engagement'); }}>
          <react_native_1.Text style={[styles.sortButtonText, sortBy === 'engagement' && styles.sortButtonTextActive]}>
            Engagement {sortBy === 'engagement' && (sortOrder === 'asc' ? '↑' : '↓')}
          </react_native_1.Text>
        </react_native_1.TouchableOpacity>
      </react_native_1.View>

      {/* Mission List */}
      <react_native_1.FlatList data={sortedMissions} renderItem={renderMissionRow} keyExtractor={function (item) { return item.id; }} scrollEnabled={false} ItemSeparatorComponent={function () { return <react_native_1.View style={styles.separator}/>; }}/>

      {/* Mission Detail Modal */}
      <react_native_1.Modal visible={selectedMission !== null} animationType="slide" transparent={true} onRequestClose={function () { return setSelectedMission(null); }}>
        <react_native_1.View style={styles.modalOverlay}>
          <react_native_1.View style={styles.modalContent}>
            {selectedMission && (<>
                <react_native_1.View style={styles.modalHeader}>
                  <react_native_1.Text style={styles.modalTitle}>Mission Details</react_native_1.Text>
                  <react_native_1.TouchableOpacity onPress={function () { return setSelectedMission(null); }} style={styles.closeButton}>
                    <react_native_1.Text style={styles.closeButtonText}>✕</react_native_1.Text>
                  </react_native_1.TouchableOpacity>
                </react_native_1.View>
                
                <react_native_1.View style={styles.modalBody}>
                  <react_native_1.Text style={styles.detailTitle}>{selectedMission.title}</react_native_1.Text>
                  <react_native_1.Text style={styles.detailDate}>{selectedMission.date}</react_native_1.Text>
                  
                  <react_native_1.View style={styles.detailMetrics}>
                    <react_native_1.View style={styles.detailMetricCard}>
                      <react_native_1.Text style={styles.detailMetricValue}>
                        {selectedMission.participants}
                      </react_native_1.Text>
                      <react_native_1.Text style={styles.detailMetricLabel}>Participants</react_native_1.Text>
                    </react_native_1.View>
                    
                    <react_native_1.View style={styles.detailMetricCard}>
                      <react_native_1.Text style={styles.detailMetricValue}>
                        {selectedMission.pointsDistributed}
                      </react_native_1.Text>
                      <react_native_1.Text style={styles.detailMetricLabel}>Points Distributed</react_native_1.Text>
                    </react_native_1.View>
                    
                    <react_native_1.View style={styles.detailMetricCard}>
                      <react_native_1.Text style={styles.detailMetricValue}>
                        {selectedMission.completionRate}%
                      </react_native_1.Text>
                      <react_native_1.Text style={styles.detailMetricLabel}>Completion Rate</react_native_1.Text>
                    </react_native_1.View>
                    
                    <react_native_1.View style={styles.detailMetricCard}>
                      <react_native_1.Text style={styles.detailMetricValue}>
                        {selectedMission.engagementScore.toFixed(1)}
                      </react_native_1.Text>
                      <react_native_1.Text style={styles.detailMetricLabel}>Engagement Score</react_native_1.Text>
                    </react_native_1.View>
                  </react_native_1.View>
                  
                  <react_native_1.View style={styles.comparisonSection}>
                    <react_native_1.Text style={styles.comparisonTitle}>Performance Analysis</react_native_1.Text>
                    <react_native_1.Text style={styles.comparisonText}>
                      This mission had {selectedMission.participants} participants, which is{' '}
                      {selectedMission.participants > 50 ? 'above' : 'below'} average.
                    </react_native_1.Text>
                    <react_native_1.Text style={styles.comparisonText}>
                      Engagement score of {selectedMission.engagementScore.toFixed(1)} indicates{' '}
                      {selectedMission.engagementScore > 7 ? 'high' : selectedMission.engagementScore > 5 ? 'moderate' : 'low'}{' '}
                      participant engagement.
                    </react_native_1.Text>
                  </react_native_1.View>
                </react_native_1.View>
              </>)}
          </react_native_1.View>
        </react_native_1.View>
      </react_native_1.Modal>
    </react_native_1.View>);
};
exports.MissionPerformanceTable = MissionPerformanceTable;
var styles = react_native_1.StyleSheet.create({
    container: {
        width: '100%',
    },
    sortControls: {
        flexDirection: 'row',
        marginBottom: theme_1.spacing.md,
        gap: theme_1.spacing.sm,
    },
    sortButton: {
        paddingHorizontal: theme_1.spacing.sm,
        paddingVertical: theme_1.spacing.xs,
        borderRadius: theme_1.borderRadius.sm,
        backgroundColor: theme_1.colors.gray100,
    },
    sortButtonActive: {
        backgroundColor: theme_1.colors.primary,
    },
    sortButtonText: __assign(__assign({}, theme_1.typography.caption), { color: theme_1.colors.textSecondary, fontWeight: '600' }),
    sortButtonTextActive: {
        color: theme_1.colors.white,
    },
    missionRow: __assign({ backgroundColor: theme_1.colors.white, borderRadius: theme_1.borderRadius.md, padding: theme_1.spacing.md }, theme_1.shadows.sm),
    missionMainInfo: {
        marginBottom: theme_1.spacing.md,
    },
    missionTitle: __assign(__assign({}, theme_1.typography.body1), { color: theme_1.colors.textPrimary, fontWeight: '600', marginBottom: theme_1.spacing.xs }),
    missionDate: __assign(__assign({}, theme_1.typography.caption), { color: theme_1.colors.textSecondary }),
    missionMetrics: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    metricItem: {
        alignItems: 'center',
    },
    metricLabel: __assign(__assign({}, theme_1.typography.caption), { color: theme_1.colors.textSecondary, marginBottom: theme_1.spacing.xs }),
    metricValue: __assign(__assign({}, theme_1.typography.body1), { color: theme_1.colors.textPrimary, fontWeight: '600' }),
    engagementBadge: {
        backgroundColor: theme_1.colors.accent,
        paddingHorizontal: theme_1.spacing.sm,
        paddingVertical: 2,
        borderRadius: theme_1.borderRadius.sm,
    },
    engagementText: __assign(__assign({}, theme_1.typography.caption), { color: theme_1.colors.white, fontWeight: '700' }),
    separator: {
        height: theme_1.spacing.sm,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: theme_1.colors.white,
        borderTopLeftRadius: theme_1.borderRadius.xl,
        borderTopRightRadius: theme_1.borderRadius.xl,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: theme_1.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme_1.colors.gray200,
    },
    modalTitle: __assign(__assign({}, theme_1.typography.h3), { color: theme_1.colors.textPrimary }),
    closeButton: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: __assign(__assign({}, theme_1.typography.h3), { color: theme_1.colors.textSecondary }),
    modalBody: {
        padding: theme_1.spacing.md,
    },
    detailTitle: __assign(__assign({}, theme_1.typography.h3), { color: theme_1.colors.textPrimary, marginBottom: theme_1.spacing.xs }),
    detailDate: __assign(__assign({}, theme_1.typography.body2), { color: theme_1.colors.textSecondary, marginBottom: theme_1.spacing.lg }),
    detailMetrics: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme_1.spacing.md,
        marginBottom: theme_1.spacing.lg,
    },
    detailMetricCard: {
        flex: 1,
        minWidth: '45%',
        backgroundColor: theme_1.colors.gray100,
        borderRadius: theme_1.borderRadius.md,
        padding: theme_1.spacing.md,
        alignItems: 'center',
    },
    detailMetricValue: __assign(__assign({}, theme_1.typography.h2), { color: theme_1.colors.textPrimary, fontWeight: '700', marginBottom: theme_1.spacing.xs }),
    detailMetricLabel: __assign(__assign({}, theme_1.typography.caption), { color: theme_1.colors.textSecondary, textAlign: 'center' }),
    comparisonSection: {
        backgroundColor: theme_1.colors.gray100,
        borderRadius: theme_1.borderRadius.md,
        padding: theme_1.spacing.md,
    },
    comparisonTitle: __assign(__assign({}, theme_1.typography.body1), { color: theme_1.colors.textPrimary, fontWeight: '600', marginBottom: theme_1.spacing.sm }),
    comparisonText: __assign(__assign({}, theme_1.typography.body2), { color: theme_1.colors.textSecondary, marginBottom: theme_1.spacing.xs, lineHeight: 20 }),
});
