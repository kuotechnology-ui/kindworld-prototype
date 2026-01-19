import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, typography, spacing, borderRadius } from '../theme';
import { useMissions } from '../hooks';
import { Mission } from '../types';

const SearchScreen: React.FC = () => {
  const navigation = useNavigation();
  const { missions, loading } = useMissions();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All', icon: '🌟' },
    { id: 'volunteer', label: 'Volunteer', icon: '🤝' },
    { id: 'charity', label: 'Charity', icon: '❤️' },
    { id: 'blood_drive', label: 'Blood Drive', icon: '🩸' },
    { id: 'environment', label: 'Environment', icon: '🌱' },
    { id: 'education', label: 'Education', icon: '📚' },
  ];

  // Filter missions based on search query and category
  const filteredMissions = useMemo(() => {
    let results = missions;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        (mission) =>
          mission.title.toLowerCase().includes(query) ||
          mission.description.toLowerCase().includes(query) ||
          mission.location?.city?.toLowerCase().includes(query) ||
          mission.location?.address?.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory && selectedCategory !== 'all') {
      results = results.filter((mission) => mission.category === selectedCategory);
    }

    return results;
  }, [missions, searchQuery, selectedCategory]);

  const handleMissionPress = (missionId: string) => {
    navigation.navigate('MissionDetail' as never, { missionId } as never);
  };

  const formatDate = (dateStr: string | any) => {
    try {
      const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr.toDate();
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return '';
    }
  };

  const renderCategoryItem = ({ item }: { item: typeof categories[0] }) => (
    <TouchableOpacity
      style={[
        styles.categoryChip,
        (selectedCategory === item.id || (!selectedCategory && item.id === 'all')) &&
          styles.categoryChipActive,
      ]}
      onPress={() => setSelectedCategory(item.id === 'all' ? null : item.id)}
    >
      <Text style={styles.categoryIcon}>{item.icon}</Text>
      <Text
        style={[
          styles.categoryLabel,
          (selectedCategory === item.id || (!selectedCategory && item.id === 'all')) &&
            styles.categoryLabelActive,
        ]}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  const renderMissionItem = ({ item }: { item: Mission }) => (
    <TouchableOpacity style={styles.missionCard} onPress={() => handleMissionPress(item.id)}>
      <View style={styles.missionImageContainer}>
        {item.imageUrls && item.imageUrls.length > 0 ? (
          <Image source={{ uri: item.imageUrls[0] }} style={styles.missionImage} />
        ) : (
          <View style={styles.missionImagePlaceholder}>
            <Text style={styles.missionImagePlaceholderText}>🌟</Text>
          </View>
        )}
        <View style={styles.pointsBadge}>
          <Text style={styles.pointsText}>+{item.hoursAllocated || item.pointsReward} hrs</Text>
        </View>
      </View>

      <View style={styles.missionContent}>
        <Text style={styles.missionTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.missionDescription} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.missionMeta}>
          <View style={styles.metaItem}>
            <Text style={styles.metaIcon}>📅</Text>
            <Text style={styles.metaText}>{formatDate(item.date)}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaIcon}>📍</Text>
            <Text style={styles.metaText} numberOfLines={1}>
              {item.location?.city || 'TBD'}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaIcon}>👥</Text>
            <Text style={styles.metaText}>
              {item.currentParticipants}
              {item.maxParticipants ? `/${item.maxParticipants}` : ''}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🔍</Text>
      <Text style={styles.emptyTitle}>No missions found</Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery
          ? 'Try a different search term or category'
          : 'There are no missions available at the moment'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discover</Text>
        <Text style={styles.headerSubtitle}>Find missions that match your interests</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search missions, locations..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
              <Text style={styles.clearButtonText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {/* Results Count */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>
          {filteredMissions.length} mission{filteredMissions.length !== 1 ? 's' : ''} found
        </Text>
      </View>

      {/* Mission List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      ) : (
        <FlatList
          data={filteredMissions}
          renderItem={renderMissionItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.missionsList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyState}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  headerTitle: {
    ...typography.h1,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    ...typography.body1,
    color: colors.textSecondary,
  },
  searchContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray100 || '#F3F4F6',
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    height: 48,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...typography.body1,
    color: colors.textPrimary,
    paddingVertical: 0,
  },
  clearButton: {
    padding: spacing.xs,
  },
  clearButtonText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  categoriesContainer: {
    marginBottom: spacing.md,
  },
  categoriesList: {
    paddingHorizontal: spacing.lg,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray100 || '#F3F4F6',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    marginRight: spacing.sm,
  },
  categoryChipActive: {
    backgroundColor: colors.accent,
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: spacing.xs,
  },
  categoryLabel: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  categoryLabelActive: {
    color: colors.white,
    fontWeight: '600',
  },
  resultsHeader: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  resultsCount: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  missionsList: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  missionCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.gray200,
    overflow: 'hidden',
  },
  missionImageContainer: {
    position: 'relative',
    height: 140,
  },
  missionImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  missionImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.accent + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  missionImagePlaceholderText: {
    fontSize: 40,
  },
  pointsBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  pointsText: {
    ...typography.caption,
    color: colors.white,
    fontWeight: '600',
  },
  missionContent: {
    padding: spacing.md,
  },
  missionTitle: {
    ...typography.h3,
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  missionDescription: {
    ...typography.body2,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    lineHeight: 20,
  },
  missionMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaIcon: {
    fontSize: 14,
    marginRight: spacing.xs,
  },
  metaText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    ...typography.body2,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
});

export default SearchScreen;
