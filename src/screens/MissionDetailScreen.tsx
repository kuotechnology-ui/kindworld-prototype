import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Modal,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors, typography, spacing, borderRadius } from '../theme';
import { useMissions } from '../hooks';
import { Button } from '../components';
import { useAuth } from '../hooks/useAuth';

const MissionDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { missionId } = route.params as { missionId: string };
  const { missions, loading, getMissionById, registerForMission, isRegisteredForMission } = useMissions();
  const { user } = useAuth();

  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [registrationForm, setRegistrationForm] = useState({
    fullName: user?.displayName || '',
    email: user?.email || '',
    phone: '',
    emergencyContact: '',
    emergencyPhone: '',
  });

  const mission = missions.find(m => m.id === missionId);
  const isRegistered = isRegisteredForMission(missionId);

  useEffect(() => {
    if (!mission) {
      getMissionById(missionId);
    }
  }, [missionId]);

  const handleBackPress = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const handleJoinMission = () => {
    if (isRegistered) {
      return;
    }
    setShowRegistrationModal(true);
  };

  const handleSubmitRegistration = () => {
    // Validate form
    if (!registrationForm.fullName || !registrationForm.email || !registrationForm.phone) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }
    if (!registrationForm.emergencyContact || !registrationForm.emergencyPhone) {
      Alert.alert('Missing Information', 'Please provide emergency contact information.');
      return;
    }

    // Register for the mission
    registerForMission(missionId);
    setShowRegistrationModal(false);
    Alert.alert(
      'Registration Successful',
      'You have been registered for this mission!',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  if (loading || !mission) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      </SafeAreaView>
    );
  }

  const formatDate = (timestamp: any) => {
    const date = timestamp.toDate();
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackPress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Mission Details</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        {mission.imageUrls.length > 0 && (
          <Image
            source={{ uri: mission.imageUrls[0] }}
            style={styles.heroImage}
            resizeMode="cover"
          />
        )}

        {/* Content */}
        <View style={styles.detailsContainer}>
          {/* Title */}
          <Text style={styles.missionTitle}>{mission.title}</Text>

          {/* Date and Location */}
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>📅</Text>
            <Text style={styles.infoText}>{formatDate(mission.date)}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>📍</Text>
            <Text style={styles.infoText}>{mission.location.address}</Text>
          </View>

          {/* Points Badge */}
          <View style={styles.pointsBadge}>
            <Text style={styles.pointsText}>
              +{mission.pointsReward} Compassion Points
            </Text>
          </View>

          {/* Description */}
          <Text style={styles.sectionTitle}>About this Mission</Text>
          <Text style={styles.description}>{mission.description}</Text>

          {/* Participants */}
          <Text style={styles.sectionTitle}>Participants</Text>
          <Text style={styles.participantsText}>
            {mission.currentParticipants}
            {mission.maxParticipants && ` / ${mission.maxParticipants}`} joined
          </Text>
        </View>
      </ScrollView>

      {/* Join Button */}
      <View style={styles.footer}>
        {isRegistered ? (
          <View style={styles.registeredButton}>
            <Text style={styles.registeredButtonText}>✓ Registered</Text>
          </View>
        ) : (
          <Button
            title="Join Mission"
            onPress={handleJoinMission}
            disabled={
              mission.maxParticipants
                ? mission.currentParticipants >= mission.maxParticipants
                : false
            }
          />
        )}
      </View>

      {/* Registration Modal */}
      <Modal
        visible={showRegistrationModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowRegistrationModal(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <SafeAreaView style={styles.modalContainer}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <TouchableOpacity
                onPress={() => setShowRegistrationModal(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.modalCloseText}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Register for Mission</Text>
              <View style={{ width: 50 }} />
            </View>

            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              {/* Mission Info Banner */}
              <View style={styles.missionBanner}>
                <Text style={styles.missionBannerTitle}>{mission.title}</Text>
                <Text style={styles.missionBannerDate}>{formatDate(mission.date)}</Text>
              </View>

              {/* Personal Information */}
              <Text style={styles.formSectionTitle}>Personal Information</Text>

              <Text style={styles.inputLabel}>Full Name *</Text>
              <TextInput
                style={styles.input}
                value={registrationForm.fullName}
                onChangeText={(text) => setRegistrationForm({ ...registrationForm, fullName: text })}
                placeholder="Your full name"
                placeholderTextColor={colors.textSecondary}
              />

              <Text style={styles.inputLabel}>Email Address *</Text>
              <TextInput
                style={styles.input}
                value={registrationForm.email}
                onChangeText={(text) => setRegistrationForm({ ...registrationForm, email: text })}
                placeholder="your.email@example.com"
                placeholderTextColor={colors.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Text style={styles.inputLabel}>Phone Number *</Text>
              <TextInput
                style={styles.input}
                value={registrationForm.phone}
                onChangeText={(text) => setRegistrationForm({ ...registrationForm, phone: text })}
                placeholder="+65 1234 5678"
                placeholderTextColor={colors.textSecondary}
                keyboardType="phone-pad"
              />

              {/* Emergency Contact */}
              <Text style={styles.formSectionTitle}>Emergency Contact</Text>

              <Text style={styles.inputLabel}>Contact Name *</Text>
              <TextInput
                style={styles.input}
                value={registrationForm.emergencyContact}
                onChangeText={(text) => setRegistrationForm({ ...registrationForm, emergencyContact: text })}
                placeholder="Emergency contact name"
                placeholderTextColor={colors.textSecondary}
              />

              <Text style={styles.inputLabel}>Contact Phone *</Text>
              <TextInput
                style={styles.input}
                value={registrationForm.emergencyPhone}
                onChangeText={(text) => setRegistrationForm({ ...registrationForm, emergencyPhone: text })}
                placeholder="+65 1234 5678"
                placeholderTextColor={colors.textSecondary}
                keyboardType="phone-pad"
              />

              {/* Confirmation Note */}
              <View style={styles.confirmationNote}>
                <Text style={styles.confirmationText}>
                  By registering, I confirm that I will attend this mission on the scheduled date and time.
                </Text>
              </View>

              {/* Submit Button */}
              <Button
                title="Register Now"
                onPress={handleSubmitRegistration}
                style={styles.submitButton}
              />

              <View style={{ height: 40 }} />
            </ScrollView>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: colors.textPrimary,
  },
  title: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  heroImage: {
    width: '100%',
    height: 250,
  },
  detailsContainer: {
    padding: spacing.lg,
  },
  missionTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  infoIcon: {
    fontSize: 18,
    marginRight: spacing.sm,
  },
  infoText: {
    ...typography.body1,
    color: colors.textSecondary,
    flex: 1,
  },
  pointsBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    marginVertical: spacing.md,
  },
  pointsText: {
    ...typography.button,
    fontSize: 14,
    color: colors.white,
  },
  sectionTitle: {
    ...typography.h3,
    fontSize: 18,
    color: colors.textPrimary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  description: {
    ...typography.body1,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  participantsText: {
    ...typography.body1,
    color: colors.textSecondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
  },
  registeredButton: {
    backgroundColor: colors.success || '#10B981',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    opacity: 0.9,
  },
  registeredButtonText: {
    ...typography.button,
    color: colors.white,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  modalCloseText: {
    ...typography.body1,
    color: colors.accent,
  },
  modalTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  missionBanner: {
    backgroundColor: colors.accent + '10',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
  },
  missionBannerTitle: {
    ...typography.h3,
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  missionBannerDate: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  formSectionTitle: {
    ...typography.h3,
    fontSize: 16,
    color: colors.textPrimary,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  inputLabel: {
    ...typography.body2,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 2,
    borderColor: colors.gray200,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
    ...typography.body1,
    color: colors.textPrimary,
  },
  confirmationNote: {
    backgroundColor: colors.gray100 || '#F3F4F6',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.md,
  },
  confirmationText: {
    ...typography.body2,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  submitButton: {
    marginTop: spacing.lg,
  },
});

export default MissionDetailScreen;
