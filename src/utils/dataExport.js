"use strict";
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportMissionData = exports.exportData = exports.formatPDF = exports.formatCSV = void 0;
var react_native_1 = require("react-native");
var react_native_fs_1 = __importDefault(require("react-native-fs"));
/**
 * Format CSR metrics data as CSV
 */
var formatCSV = function (metrics) {
    var lines = [];
    // Header
    lines.push('KindWorld CSR Analytics Report');
    lines.push('');
    // Summary Metrics
    lines.push('Summary Metrics');
    lines.push('Metric,Value');
    lines.push("Total Participants,".concat(metrics.totalParticipants));
    lines.push("Points Distributed,".concat(metrics.totalPointsDistributed));
    lines.push("Missions Sponsored,".concat(metrics.totalMissionsSponsored));
    lines.push("Impact Score,".concat(metrics.impactScore.toFixed(2)));
    lines.push('');
    // Participation Over Time
    lines.push('Participation Over Time');
    lines.push('Date,Participants');
    metrics.participationOverTime.forEach(function (item) {
        lines.push("".concat(item.date, ",").concat(item.participants));
    });
    lines.push('');
    // Mission Categories
    lines.push('Mission Categories');
    lines.push('Category,Count,Percentage');
    metrics.missionCategories.forEach(function (item) {
        lines.push("".concat(item.category, ",").concat(item.count, ",").concat(item.percentage.toFixed(2), "%"));
    });
    lines.push('');
    // Geographic Distribution
    lines.push('Geographic Distribution');
    lines.push('City,Participants');
    metrics.geographicDistribution.forEach(function (item) {
        lines.push("".concat(item.city, ",").concat(item.participants));
    });
    lines.push('');
    // Mission Performance
    lines.push('Mission Performance');
    lines.push('Title,Date,Participants,Points Distributed,Completion Rate,Engagement Score');
    metrics.sponsoredMissions.forEach(function (mission) {
        lines.push("\"".concat(mission.title, "\",").concat(mission.date, ",").concat(mission.participants, ",").concat(mission.pointsDistributed, ",").concat(mission.completionRate, "%,").concat(mission.engagementScore.toFixed(2)));
    });
    return lines.join('\n');
};
exports.formatCSV = formatCSV;
/**
 * Format CSR metrics data as simple text-based PDF content
 */
var formatPDF = function (metrics, companyName) {
    var lines = [];
    lines.push('═══════════════════════════════════════════════════');
    lines.push('           KindWorld CSR Analytics Report          ');
    lines.push("                  ".concat(companyName, "                   "));
    lines.push('═══════════════════════════════════════════════════');
    lines.push('');
    lines.push('SUMMARY METRICS');
    lines.push('───────────────────────────────────────────────────');
    lines.push("Total Participants:      ".concat(metrics.totalParticipants.toLocaleString()));
    lines.push("Points Distributed:      ".concat(metrics.totalPointsDistributed.toLocaleString()));
    lines.push("Missions Sponsored:      ".concat(metrics.totalMissionsSponsored));
    lines.push("Impact Score:            ".concat(metrics.impactScore.toFixed(2)));
    lines.push('');
    lines.push('MISSION CATEGORIES');
    lines.push('───────────────────────────────────────────────────');
    metrics.missionCategories.forEach(function (item) {
        lines.push("".concat(item.category.padEnd(30), " ").concat(item.count.toString().padStart(5), " (").concat(item.percentage.toFixed(1), "%)"));
    });
    lines.push('');
    lines.push('GEOGRAPHIC DISTRIBUTION');
    lines.push('───────────────────────────────────────────────────');
    metrics.geographicDistribution.slice(0, 10).forEach(function (item) {
        lines.push("".concat(item.city.padEnd(30), " ").concat(item.participants.toString().padStart(5), " participants"));
    });
    lines.push('');
    lines.push('TOP PERFORMING MISSIONS');
    lines.push('───────────────────────────────────────────────────');
    var topMissions = __spreadArray([], metrics.sponsoredMissions, true).sort(function (a, b) { return b.engagementScore - a.engagementScore; })
        .slice(0, 10);
    topMissions.forEach(function (mission, index) {
        lines.push("".concat(index + 1, ". ").concat(mission.title));
        lines.push("   Date: ".concat(mission.date));
        lines.push("   Participants: ".concat(mission.participants, " | Points: ").concat(mission.pointsDistributed));
        lines.push("   Engagement: ".concat(mission.engagementScore.toFixed(1), " | Completion: ").concat(mission.completionRate, "%"));
        lines.push('');
    });
    lines.push('═══════════════════════════════════════════════════');
    lines.push("Generated on: ".concat(new Date().toLocaleDateString()));
    lines.push('═══════════════════════════════════════════════════');
    return lines.join('\n');
};
exports.formatPDF = formatPDF;
/**
 * Export CSR metrics data
 */
var exportData = function (metrics, format, companyName) { return __awaiter(void 0, void 0, void 0, function () {
    var timestamp, fileName, content, mimeType, filePath, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                timestamp = new Date().toISOString().split('T')[0];
                fileName = "CSR_Analytics_".concat(companyName.replace(/\s+/g, '_'), "_").concat(timestamp, ".").concat(format);
                content = void 0;
                mimeType = void 0;
                if (format === 'csv') {
                    content = (0, exports.formatCSV)(metrics);
                    mimeType = 'text/csv';
                }
                else {
                    content = (0, exports.formatPDF)(metrics, companyName);
                    mimeType = 'text/plain'; // Using plain text as a simple PDF alternative
                }
                filePath = react_native_1.Platform.select({
                    ios: "".concat(react_native_fs_1.default.DocumentDirectoryPath, "/").concat(fileName),
                    android: "".concat(react_native_fs_1.default.DownloadDirectoryPath, "/").concat(fileName),
                    default: "".concat(react_native_fs_1.default.DocumentDirectoryPath, "/").concat(fileName),
                });
                // Write file
                return [4 /*yield*/, react_native_fs_1.default.writeFile(filePath, content, 'utf8')];
            case 1:
                // Write file
                _a.sent();
                // Share the file
                return [4 /*yield*/, react_native_1.Share.share({
                        title: "CSR Analytics Report - ".concat(companyName),
                        message: "CSR Analytics Report for ".concat(companyName),
                        url: react_native_1.Platform.OS === 'ios' ? filePath : "file://".concat(filePath),
                    })];
            case 2:
                // Share the file
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                console.error('Error exporting data:', error_1);
                throw new Error('Failed to export data. Please try again.');
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.exportData = exportData;
/**
 * Export individual mission data
 */
var exportMissionData = function (mission, format) { return __awaiter(void 0, void 0, void 0, function () {
    var timestamp, fileName, content, filePath, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                timestamp = new Date().toISOString().split('T')[0];
                fileName = "Mission_".concat(mission.id, "_").concat(timestamp, ".").concat(format);
                content = void 0;
                if (format === 'csv') {
                    content = [
                        'Mission Performance Report',
                        '',
                        'Mission Details',
                        'Field,Value',
                        "Title,\"".concat(mission.title, "\""),
                        "Date,".concat(mission.date),
                        "Participants,".concat(mission.participants),
                        "Points Distributed,".concat(mission.pointsDistributed),
                        "Completion Rate,".concat(mission.completionRate, "%"),
                        "Engagement Score,".concat(mission.engagementScore.toFixed(2)),
                    ].join('\n');
                }
                else {
                    content = [
                        '═══════════════════════════════════════════════════',
                        '           Mission Performance Report              ',
                        '═══════════════════════════════════════════════════',
                        '',
                        "Title: ".concat(mission.title),
                        "Date: ".concat(mission.date),
                        '',
                        'METRICS',
                        '───────────────────────────────────────────────────',
                        "Participants:        ".concat(mission.participants),
                        "Points Distributed:  ".concat(mission.pointsDistributed),
                        "Completion Rate:     ".concat(mission.completionRate, "%"),
                        "Engagement Score:    ".concat(mission.engagementScore.toFixed(2)),
                        '',
                        '═══════════════════════════════════════════════════',
                        "Generated on: ".concat(new Date().toLocaleDateString()),
                        '═══════════════════════════════════════════════════',
                    ].join('\n');
                }
                filePath = react_native_1.Platform.select({
                    ios: "".concat(react_native_fs_1.default.DocumentDirectoryPath, "/").concat(fileName),
                    android: "".concat(react_native_fs_1.default.DownloadDirectoryPath, "/").concat(fileName),
                    default: "".concat(react_native_fs_1.default.DocumentDirectoryPath, "/").concat(fileName),
                });
                return [4 /*yield*/, react_native_fs_1.default.writeFile(filePath, content, 'utf8')];
            case 1:
                _a.sent();
                return [4 /*yield*/, react_native_1.Share.share({
                        title: "Mission Report - ".concat(mission.title),
                        message: "Performance report for mission: ".concat(mission.title),
                        url: react_native_1.Platform.OS === 'ios' ? filePath : "file://".concat(filePath),
                    })];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                error_2 = _a.sent();
                console.error('Error exporting mission data:', error_2);
                throw new Error('Failed to export mission data. Please try again.');
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.exportMissionData = exportMissionData;
