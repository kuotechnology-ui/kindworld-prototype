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
exports.CategoryPieChart = void 0;
var react_1 = __importDefault(require("react"));
var react_native_1 = require("react-native");
var victory_native_1 = require("victory-native");
var theme_1 = require("../theme");
var CHART_COLORS = [
    theme_1.colors.accent,
    '#FF6B6B',
    '#4ECDC4',
    '#FFD93D',
    '#95E1D3',
    '#A8E6CF',
];
var CategoryPieChart = function (_a) {
    var data = _a.data;
    // Transform data for Victory
    var chartData = data.map(function (item, index) { return ({
        x: item.category,
        y: item.count,
        color: CHART_COLORS[index % CHART_COLORS.length],
    }); });
    return (<react_native_1.View style={styles.container}>
      <react_native_1.View style={styles.chartContainer}>
        <victory_native_1.VictoryPie data={chartData} width={280} height={280} colorScale={CHART_COLORS} innerRadius={60} labelRadius={100} style={{
            labels: {
                fontSize: 12,
                fill: theme_1.colors.textPrimary,
                fontWeight: '600',
            },
        }} labels={function (_a) {
        var datum = _a.datum;
        return "".concat(datum.y);
    }}/>
      </react_native_1.View>
      
      {/* Legend */}
      <react_native_1.View style={styles.legend}>
        {data.map(function (item, index) { return (<react_native_1.View key={item.category} style={styles.legendItem}>
            <react_native_1.View style={[
                styles.legendColor,
                { backgroundColor: CHART_COLORS[index % CHART_COLORS.length] },
            ]}/>
            <react_native_1.Text style={styles.legendText}>
              {item.category} ({item.percentage.toFixed(1)}%)
            </react_native_1.Text>
          </react_native_1.View>); })}
      </react_native_1.View>
    </react_native_1.View>);
};
exports.CategoryPieChart = CategoryPieChart;
var styles = react_native_1.StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    chartContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    legend: {
        marginTop: theme_1.spacing.md,
        width: '100%',
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme_1.spacing.sm,
    },
    legendColor: {
        width: 16,
        height: 16,
        borderRadius: 4,
        marginRight: theme_1.spacing.sm,
    },
    legendText: __assign(__assign({}, theme_1.typography.body2), { color: theme_1.colors.textPrimary }),
});
