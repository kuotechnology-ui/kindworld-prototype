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
exports.MissionForm = void 0;
var react_1 = __importStar(require("react"));
var react_native_1 = require("react-native");
var datetimepicker_1 = __importDefault(require("@react-native-community/datetimepicker"));
var react_native_image_picker_1 = require("react-native-image-picker");
var _1 = require("./");
var theme_1 = require("../theme");
var CATEGORIES = [
    { label: 'Volunteer', value: 'volunteer' },
    { label: 'Donation', value: 'donation' },
    { label: 'Charity', value: 'charity' },
    { label: 'Blood Drive', value: 'blood_drive' },
    { label: 'Other', value: 'other' },
];
var MissionForm = function (_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    var initialData = _a.initialData, onSubmit = _a.onSubmit, onCancel = _a.onCancel, _m = _a.loading, loading = _m === void 0 ? false : _m, _o = _a.uploadProgress, uploadProgress = _o === void 0 ? 0 : _o;
    var _p = (0, react_1.useState)((initialData === null || initialData === void 0 ? void 0 : initialData.title) || ''), title = _p[0], setTitle = _p[1];
    var _q = (0, react_1.useState)((initialData === null || initialData === void 0 ? void 0 : initialData.description) || ''), description = _q[0], setDescription = _q[1];
    var _r = (0, react_1.useState)((initialData === null || initialData === void 0 ? void 0 : initialData.date) ? initialData.date.toDate() : new Date()), date = _r[0], setDate = _r[1];
    var _s = (0, react_1.useState)(false), showDatePicker = _s[0], setShowDatePicker = _s[1];
    var _t = (0, react_1.useState)(false), showTimePicker = _t[0], setShowTimePicker = _t[1];
    var _u = (0, react_1.useState)(((_b = initialData === null || initialData === void 0 ? void 0 : initialData.location) === null || _b === void 0 ? void 0 : _b.address) || ''), address = _u[0], setAddress = _u[1];
    var _v = (0, react_1.useState)(((_c = initialData === null || initialData === void 0 ? void 0 : initialData.location) === null || _c === void 0 ? void 0 : _c.city) || ''), city = _v[0], setCity = _v[1];
    var _w = (0, react_1.useState)(((_f = (_e = (_d = initialData === null || initialData === void 0 ? void 0 : initialData.location) === null || _d === void 0 ? void 0 : _d.coordinates) === null || _e === void 0 ? void 0 : _e.latitude) === null || _f === void 0 ? void 0 : _f.toString()) || ''), latitude = _w[0], setLatitude = _w[1];
    var _x = (0, react_1.useState)(((_j = (_h = (_g = initialData === null || initialData === void 0 ? void 0 : initialData.location) === null || _g === void 0 ? void 0 : _g.coordinates) === null || _h === void 0 ? void 0 : _h.longitude) === null || _j === void 0 ? void 0 : _j.toString()) || ''), longitude = _x[0], setLongitude = _x[1];
    var _y = (0, react_1.useState)(((_k = initialData === null || initialData === void 0 ? void 0 : initialData.pointsReward) === null || _k === void 0 ? void 0 : _k.toString()) || ''), pointsReward = _y[0], setPointsReward = _y[1];
    var _z = (0, react_1.useState)((initialData === null || initialData === void 0 ? void 0 : initialData.category) || 'volunteer'), category = _z[0], setCategory = _z[1];
    var _0 = (0, react_1.useState)(((_l = initialData === null || initialData === void 0 ? void 0 : initialData.maxParticipants) === null || _l === void 0 ? void 0 : _l.toString()) || ''), maxParticipants = _0[0], setMaxParticipants = _0[1];
    var _2 = (0, react_1.useState)((initialData === null || initialData === void 0 ? void 0 : initialData.sponsorId) || ''), sponsorId = _2[0], setSponsorId = _2[1];
    var _3 = (0, react_1.useState)((initialData === null || initialData === void 0 ? void 0 : initialData.imageUrls) || []), imageUris = _3[0], setImageUris = _3[1];
    var _4 = (0, react_1.useState)({}), errors = _4[0], setErrors = _4[1];
    var validateForm = function () {
        var newErrors = {};
        if (!title.trim()) {
            newErrors.title = 'Title is required';
        }
        if (!description.trim()) {
            newErrors.description = 'Description is required';
        }
        if (!address.trim()) {
            newErrors.address = 'Address is required';
        }
        if (!city.trim()) {
            newErrors.city = 'City is required';
        }
        var lat = parseFloat(latitude);
        if (isNaN(lat) || lat < -90 || lat > 90) {
            newErrors.latitude = 'Valid latitude is required (-90 to 90)';
        }
        var lng = parseFloat(longitude);
        if (isNaN(lng) || lng < -180 || lng > 180) {
            newErrors.longitude = 'Valid longitude is required (-180 to 180)';
        }
        var points = parseInt(pointsReward, 10);
        if (isNaN(points) || points <= 0) {
            newErrors.pointsReward = 'Points reward must be greater than 0';
        }
        if (maxParticipants && parseInt(maxParticipants, 10) <= 0) {
            newErrors.maxParticipants = 'Max participants must be greater than 0';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    var handleSubmit = function () {
        if (!validateForm()) {
            react_native_1.Alert.alert('Validation Error', 'Please fix the errors in the form');
            return;
        }
        var formData = {
            title: title.trim(),
            description: description.trim(),
            date: date,
            location: {
                address: address.trim(),
                city: city.trim(),
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
            },
            pointsReward: parseInt(pointsReward, 10),
            category: category,
            maxParticipants: maxParticipants
                ? parseInt(maxParticipants, 10)
                : undefined,
            sponsorId: sponsorId.trim() || undefined,
            imageUris: imageUris.length > 0 ? imageUris : undefined,
        };
        onSubmit(formData);
    };
    var handleDateChange = function (event, selectedDate) {
        setShowDatePicker(react_native_1.Platform.OS === 'ios');
        if (selectedDate) {
            setDate(selectedDate);
        }
    };
    var handleTimeChange = function (event, selectedTime) {
        setShowTimePicker(react_native_1.Platform.OS === 'ios');
        if (selectedTime) {
            var newDate = new Date(date);
            newDate.setHours(selectedTime.getHours());
            newDate.setMinutes(selectedTime.getMinutes());
            setDate(newDate);
        }
    };
    var handleImagePicker = function () { return __awaiter(void 0, void 0, void 0, function () {
        var result, newUris;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, react_native_image_picker_1.launchImageLibrary)({
                        mediaType: 'photo',
                        quality: 0.8,
                        selectionLimit: 5 - imageUris.length,
                    })];
                case 1:
                    result = _a.sent();
                    if (result.assets) {
                        newUris = result.assets
                            .map(function (asset) { return asset.uri; })
                            .filter(function (uri) { return uri !== undefined; });
                        setImageUris(__spreadArray(__spreadArray([], imageUris, true), newUris, true));
                    }
                    return [2 /*return*/];
            }
        });
    }); };
    var handleRemoveImage = function (index) {
        setImageUris(imageUris.filter(function (_, i) { return i !== index; }));
    };
    return (<react_native_1.ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <react_native_1.Text style={styles.sectionTitle}>Basic Information</react_native_1.Text>

      <_1.Input label="Mission Title" value={title} onChangeText={setTitle} placeholder="Enter mission title" error={errors.title} editable={!loading}/>

      <_1.Input label="Description" value={description} onChangeText={setDescription} placeholder="Enter mission description" multiline numberOfLines={4} error={errors.description} editable={!loading} style={styles.textArea}/>

      <react_native_1.Text style={styles.sectionTitle}>Date & Time</react_native_1.Text>

      <react_native_1.TouchableOpacity style={styles.dateButton} onPress={function () { return setShowDatePicker(true); }} disabled={loading}>
        <react_native_1.Text style={styles.dateButtonLabel}>Date</react_native_1.Text>
        <react_native_1.Text style={styles.dateButtonValue}>{date.toLocaleDateString()}</react_native_1.Text>
      </react_native_1.TouchableOpacity>

      <react_native_1.TouchableOpacity style={styles.dateButton} onPress={function () { return setShowTimePicker(true); }} disabled={loading}>
        <react_native_1.Text style={styles.dateButtonLabel}>Time</react_native_1.Text>
        <react_native_1.Text style={styles.dateButtonValue}>{date.toLocaleTimeString()}</react_native_1.Text>
      </react_native_1.TouchableOpacity>

      {showDatePicker && (<datetimepicker_1.default value={date} mode="date" display="default" onChange={handleDateChange} minimumDate={new Date()}/>)}

      {showTimePicker && (<datetimepicker_1.default value={date} mode="time" display="default" onChange={handleTimeChange}/>)}

      <react_native_1.Text style={styles.sectionTitle}>Location</react_native_1.Text>

      <_1.Input label="Address" value={address} onChangeText={setAddress} placeholder="Enter street address" error={errors.address} editable={!loading}/>

      <_1.Input label="City" value={city} onChangeText={setCity} placeholder="Enter city" error={errors.city} editable={!loading}/>

      <react_native_1.View style={styles.row}>
        <react_native_1.View style={styles.halfWidth}>
          <_1.Input label="Latitude" value={latitude} onChangeText={setLatitude} placeholder="e.g., 25.0330" keyboardType="numeric" error={errors.latitude} editable={!loading}/>
        </react_native_1.View>
        <react_native_1.View style={styles.halfWidth}>
          <_1.Input label="Longitude" value={longitude} onChangeText={setLongitude} placeholder="e.g., 121.5654" keyboardType="numeric" error={errors.longitude} editable={!loading}/>
        </react_native_1.View>
      </react_native_1.View>

      <react_native_1.Text style={styles.sectionTitle}>Mission Details</react_native_1.Text>

      <react_native_1.Text style={styles.label}>Category</react_native_1.Text>
      <react_native_1.View style={styles.categoryContainer}>
        {CATEGORIES.map(function (cat) { return (<react_native_1.TouchableOpacity key={cat.value} style={[
                styles.categoryButton,
                category === cat.value && styles.categoryButtonActive,
            ]} onPress={function () { return setCategory(cat.value); }} disabled={loading}>
            <react_native_1.Text style={[
                styles.categoryButtonText,
                category === cat.value && styles.categoryButtonTextActive,
            ]}>
              {cat.label}
            </react_native_1.Text>
          </react_native_1.TouchableOpacity>); })}
      </react_native_1.View>

      <_1.Input label="Points Reward" value={pointsReward} onChangeText={setPointsReward} placeholder="Enter points reward" keyboardType="numeric" error={errors.pointsReward} editable={!loading}/>

      <_1.Input label="Max Participants (Optional)" value={maxParticipants} onChangeText={setMaxParticipants} placeholder="Leave empty for unlimited" keyboardType="numeric" error={errors.maxParticipants} editable={!loading}/>

      <_1.Input label="Sponsor ID (Optional)" value={sponsorId} onChangeText={setSponsorId} placeholder="Enter company sponsor ID" editable={!loading}/>

      <react_native_1.Text style={styles.sectionTitle}>Images</react_native_1.Text>

      <react_native_1.View style={styles.imageContainer}>
        {imageUris.map(function (uri, index) { return (<react_native_1.View key={index} style={styles.imageWrapper}>
            <react_native_1.Image source={{ uri: uri }} style={styles.image}/>
            <react_native_1.TouchableOpacity style={styles.removeImageButton} onPress={function () { return handleRemoveImage(index); }} disabled={loading}>
              <react_native_1.Text style={styles.removeImageText}>×</react_native_1.Text>
            </react_native_1.TouchableOpacity>
          </react_native_1.View>); })}
        {imageUris.length < 5 && (<react_native_1.TouchableOpacity style={styles.addImageButton} onPress={handleImagePicker} disabled={loading}>
            <react_native_1.Text style={styles.addImageText}>+</react_native_1.Text>
          </react_native_1.TouchableOpacity>)}
      </react_native_1.View>

      {loading && uploadProgress > 0 && (<react_native_1.View style={styles.progressContainer}>
          <react_native_1.View style={styles.progressBar}>
            <react_native_1.View style={[styles.progressFill, { width: "".concat(uploadProgress, "%") }]}/>
          </react_native_1.View>
          <react_native_1.Text style={styles.progressText}>
            Uploading... {Math.round(uploadProgress)}%
          </react_native_1.Text>
        </react_native_1.View>)}

      <react_native_1.View style={styles.buttonContainer}>
        <_1.Button title="Cancel" onPress={onCancel} variant="secondary" disabled={loading} style={styles.button}/>
        <_1.Button title={initialData ? 'Update Mission' : 'Create Mission'} onPress={handleSubmit} disabled={loading} style={styles.button}/>
      </react_native_1.View>
    </react_native_1.ScrollView>);
};
exports.MissionForm = MissionForm;
var styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme_1.colors.white,
    },
    content: {
        padding: theme_1.spacing.md,
    },
    sectionTitle: __assign(__assign({}, theme_1.typography.h3), { color: theme_1.colors.textPrimary, marginTop: theme_1.spacing.lg, marginBottom: theme_1.spacing.md }),
    textArea: {
        minHeight: 100,
        textAlignVertical: 'top',
    },
    dateButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: theme_1.spacing.md,
        backgroundColor: theme_1.colors.gray100,
        borderRadius: theme_1.borderRadius.sm,
        marginBottom: theme_1.spacing.md,
    },
    dateButtonLabel: __assign(__assign({}, theme_1.typography.body1), { color: theme_1.colors.textSecondary }),
    dateButtonValue: __assign(__assign({}, theme_1.typography.body1), { color: theme_1.colors.textPrimary, fontWeight: '600' }),
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: theme_1.spacing.md,
    },
    halfWidth: {
        flex: 1,
    },
    label: __assign(__assign({}, theme_1.typography.body2), { color: theme_1.colors.textPrimary, fontWeight: '600', marginBottom: theme_1.spacing.sm }),
    categoryContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme_1.spacing.sm,
        marginBottom: theme_1.spacing.md,
    },
    categoryButton: {
        paddingHorizontal: theme_1.spacing.md,
        paddingVertical: theme_1.spacing.sm,
        backgroundColor: theme_1.colors.gray100,
        borderRadius: theme_1.borderRadius.sm,
        borderWidth: 1,
        borderColor: theme_1.colors.gray200,
    },
    categoryButtonActive: {
        backgroundColor: theme_1.colors.primary,
        borderColor: theme_1.colors.primary,
    },
    categoryButtonText: __assign(__assign({}, theme_1.typography.body2), { color: theme_1.colors.textPrimary }),
    categoryButtonTextActive: {
        color: theme_1.colors.white,
        fontWeight: '600',
    },
    imageContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme_1.spacing.sm,
        marginBottom: theme_1.spacing.lg,
    },
    imageWrapper: {
        position: 'relative',
        width: 100,
        height: 100,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: theme_1.borderRadius.sm,
    },
    removeImageButton: {
        position: 'absolute',
        top: -8,
        right: -8,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: theme_1.colors.error,
        justifyContent: 'center',
        alignItems: 'center',
    },
    removeImageText: {
        color: theme_1.colors.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
    addImageButton: {
        width: 100,
        height: 100,
        borderRadius: theme_1.borderRadius.sm,
        borderWidth: 2,
        borderColor: theme_1.colors.gray300,
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme_1.colors.gray100,
    },
    addImageText: {
        fontSize: 32,
        color: theme_1.colors.gray400,
    },
    progressContainer: {
        marginBottom: theme_1.spacing.lg,
    },
    progressBar: {
        height: 8,
        backgroundColor: theme_1.colors.gray200,
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: theme_1.spacing.sm,
    },
    progressFill: {
        height: '100%',
        backgroundColor: theme_1.colors.accent,
    },
    progressText: __assign(__assign({}, theme_1.typography.caption), { color: theme_1.colors.textSecondary, textAlign: 'center' }),
    buttonContainer: {
        flexDirection: 'row',
        gap: theme_1.spacing.md,
        marginTop: theme_1.spacing.lg,
        marginBottom: theme_1.spacing.xxl,
    },
    button: {
        flex: 1,
    },
});
