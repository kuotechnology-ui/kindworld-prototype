"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParticipationChart = void 0;
var react_1 = __importDefault(require("react"));
var react_native_1 = require("react-native");
var victory_native_1 = require("victory-native");
var theme_1 = require("../theme");
var width = react_native_1.Dimensions.get('window').width;
var CHART_WIDTH = width - 32;
var ParticipationChart = function (_a) {
    var data = _a.data;
    // Transform data for Victory
    var chartData = data.map(function (item) { return ({
        x: item.date,
        y: item.participants,
    }); });
    return (<react_native_1.View style={styles.container}>
      <victory_native_1.VictoryChart width={CHART_WIDTH} height={220} theme={victory_native_1.VictoryTheme.material} padding={{ top: 20, bottom: 40, left: 50, right: 20 }}>
        <victory_native_1.VictoryAxis style={{
            axis: { stroke: theme_1.colors.gray300 },
            tickLabels: {
                fontSize: 10,
                fill: theme_1.colors.textSecondary,
                angle: -45,
                textAnchor: 'end',
            },
            grid: { stroke: 'transparent' },
        }}/>
        <victory_native_1.VictoryAxis dependentAxis style={{
            axis: { stroke: theme_1.colors.gray300 },
            tickLabels: {
                fontSize: 10,
                fill: theme_1.colors.textSecondary,
            },
            grid: { stroke: theme_1.colors.gray200, strokeDasharray: '4,4' },
        }}/>
        <victory_native_1.VictoryLine data={chartData} style={{
            data: {
                stroke: theme_1.colors.accent,
                strokeWidth: 3,
            },
        }} interpolation="monotoneX"/>
      </victory_native_1.VictoryChart>
    </react_native_1.View>);
};
exports.ParticipationChart = ParticipationChart;
var styles = react_native_1.StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});
