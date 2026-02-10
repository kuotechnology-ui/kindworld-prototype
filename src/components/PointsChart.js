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
exports.PointsChart = void 0;
var react_1 = __importDefault(require("react"));
var react_native_1 = require("react-native");
var theme_1 = require("../theme");
var CHART_HEIGHT = 200;
var CHART_WIDTH = react_native_1.Dimensions.get('window').width - theme_1.spacing.md * 2;
var CHART_PADDING = theme_1.spacing.md;
var PointsChart = function (_a) {
    var _b, _c, _d;
    var data = _a.data;
    if (!data || data.length === 0) {
        return (<react_native_1.View style={styles.emptyContainer}>
        <react_native_1.Text style={styles.emptyText}>No data available</react_native_1.Text>
      </react_native_1.View>);
    }
    // Calculate min and max for scaling
    var points = data.map(function (d) { return d.points; });
    var minPoints = Math.min.apply(Math, points);
    var maxPoints = Math.max.apply(Math, points);
    var range = maxPoints - minPoints || 1;
    // Calculate chart dimensions
    var chartInnerHeight = CHART_HEIGHT - CHART_PADDING * 2;
    var chartInnerWidth = CHART_WIDTH - CHART_PADDING * 2;
    var pointSpacing = chartInnerWidth / (data.length - 1 || 1);
    // Generate path for the line
    var generatePath = function () {
        return data
            .map(function (point, index) {
            var x = CHART_PADDING + index * pointSpacing;
            var normalizedValue = (point.points - minPoints) / range;
            var y = CHART_HEIGHT - CHART_PADDING - normalizedValue * chartInnerHeight;
            return "".concat(index === 0 ? 'M' : 'L', " ").concat(x, " ").concat(y);
        })
            .join(' ');
    };
    // Generate gradient fill path
    var generateFillPath = function () {
        var linePath = data
            .map(function (point, index) {
            var x = CHART_PADDING + index * pointSpacing;
            var normalizedValue = (point.points - minPoints) / range;
            var y = CHART_HEIGHT - CHART_PADDING - normalizedValue * chartInnerHeight;
            return "".concat(index === 0 ? 'M' : 'L', " ").concat(x, " ").concat(y);
        })
            .join(' ');
        var lastX = CHART_PADDING + (data.length - 1) * pointSpacing;
        return "".concat(linePath, " L ").concat(lastX, " ").concat(CHART_HEIGHT - CHART_PADDING, " L ").concat(CHART_PADDING, " ").concat(CHART_HEIGHT - CHART_PADDING, " Z");
    };
    // Render dots for each data point
    var renderDots = function () {
        return data.map(function (point, index) {
            var x = CHART_PADDING + index * pointSpacing;
            var normalizedValue = (point.points - minPoints) / range;
            var y = CHART_HEIGHT - CHART_PADDING - normalizedValue * chartInnerHeight;
            return (<react_native_1.View key={index} style={[
                    styles.dot,
                    {
                        left: x - 4,
                        top: y - 4,
                    },
                ]}/>);
        });
    };
    // Render line using positioned views (simplified approach)
    var renderLine = function () {
        var segments = [];
        for (var i = 0; i < data.length - 1; i++) {
            var x1 = CHART_PADDING + i * pointSpacing;
            var normalizedValue1 = (data[i].points - minPoints) / range;
            var y1 = CHART_HEIGHT - CHART_PADDING - normalizedValue1 * chartInnerHeight;
            var x2 = CHART_PADDING + (i + 1) * pointSpacing;
            var normalizedValue2 = (data[i + 1].points - minPoints) / range;
            var y2 = CHART_HEIGHT - CHART_PADDING - normalizedValue2 * chartInnerHeight;
            var length_1 = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
            var angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
            segments.push(<react_native_1.View key={i} style={[
                    styles.lineSegment,
                    {
                        width: length_1,
                        left: x1,
                        top: y1,
                        transform: [{ rotate: "".concat(angle, "deg") }],
                    },
                ]}/>);
        }
        return segments;
    };
    // Show Y-axis labels
    var yAxisLabels = [maxPoints, Math.round((maxPoints + minPoints) / 2), minPoints];
    return (<react_native_1.View style={styles.container}>
      <react_native_1.View style={styles.chartContainer}>
        {/* Y-axis labels */}
        <react_native_1.View style={styles.yAxis}>
          {yAxisLabels.map(function (label, index) { return (<react_native_1.Text key={index} style={styles.yAxisLabel}>
              {label.toLocaleString()}
            </react_native_1.Text>); })}
        </react_native_1.View>

        {/* Chart area */}
        <react_native_1.View style={styles.chartArea}>
          {/* Grid lines */}
          <react_native_1.View style={styles.gridLines}>
            {[0, 1, 2].map(function (i) { return (<react_native_1.View key={i} style={styles.gridLine}/>); })}
          </react_native_1.View>

          {/* Line segments */}
          {renderLine()}

          {/* Dots */}
          {renderDots()}
        </react_native_1.View>
      </react_native_1.View>

      {/* X-axis labels */}
      <react_native_1.View style={styles.xAxis}>
        <react_native_1.Text style={styles.xAxisLabel}>{((_b = data[0]) === null || _b === void 0 ? void 0 : _b.date) || ''}</react_native_1.Text>
        <react_native_1.Text style={styles.xAxisLabel}>
          {((_c = data[Math.floor(data.length / 2)]) === null || _c === void 0 ? void 0 : _c.date) || ''}
        </react_native_1.Text>
        <react_native_1.Text style={styles.xAxisLabel}>{((_d = data[data.length - 1]) === null || _d === void 0 ? void 0 : _d.date) || ''}</react_native_1.Text>
      </react_native_1.View>
    </react_native_1.View>);
};
exports.PointsChart = PointsChart;
var styles = react_native_1.StyleSheet.create({
    container: {
        backgroundColor: theme_1.colors.white,
        borderRadius: theme_1.borderRadius.lg,
        padding: theme_1.spacing.md,
    },
    emptyContainer: {
        height: CHART_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: __assign(__assign({}, theme_1.typography.body2), { color: theme_1.colors.textSecondary }),
    chartContainer: {
        flexDirection: 'row',
        height: CHART_HEIGHT,
    },
    yAxis: {
        width: 50,
        justifyContent: 'space-between',
        paddingVertical: CHART_PADDING,
    },
    yAxisLabel: __assign(__assign({}, theme_1.typography.caption), { color: theme_1.colors.textSecondary, textAlign: 'right' }),
    chartArea: {
        flex: 1,
        position: 'relative',
    },
    gridLines: {
        position: 'absolute',
        top: CHART_PADDING,
        left: 0,
        right: 0,
        bottom: CHART_PADDING,
        justifyContent: 'space-between',
    },
    gridLine: {
        height: 1,
        backgroundColor: theme_1.colors.gray200,
    },
    lineSegment: {
        position: 'absolute',
        height: 3,
        backgroundColor: theme_1.colors.accent,
        borderRadius: 1.5,
        transformOrigin: 'left center',
    },
    dot: {
        position: 'absolute',
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: theme_1.colors.accent,
        borderWidth: 2,
        borderColor: theme_1.colors.white,
    },
    xAxis: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: theme_1.spacing.sm,
        paddingHorizontal: 50,
    },
    xAxisLabel: __assign(__assign({}, theme_1.typography.caption), { color: theme_1.colors.textSecondary }),
});
