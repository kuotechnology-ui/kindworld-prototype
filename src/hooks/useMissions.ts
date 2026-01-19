import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import {
  fetchMissions,
  fetchMissionById,
  toggleFavorite,
  loadFavorites,
  setFilters,
  setSortBy,
  clearMissions,
  registerForMission,
  unregisterFromMission,
} from '../store/slices/missionsSlice';
import { FilterOptions } from '../components/FilterModal';
import { SortOption } from '../components/SortModal';

export const useMissions = () => {
  const dispatch = useAppDispatch();
  const {
    missions,
    favorites,
    registeredMissionIds,
    loading,
    error,
    hasMore,
    filters,
    sortBy,
  } = useAppSelector(state => state.missions);

  // Load initial missions and favorites
  useEffect(() => {
    dispatch(loadFavorites());
    dispatch(fetchMissions({ filters, sortBy, reset: true }));
  }, []);

  // Fetch missions with current filters and sort
  const refreshMissions = useCallback(() => {
    dispatch(clearMissions());
    dispatch(fetchMissions({ filters, sortBy, reset: true }));
  }, [dispatch, filters, sortBy]);

  // Load more missions (pagination)
  const loadMoreMissions = useCallback(() => {
    if (!loading && hasMore) {
      dispatch(fetchMissions({ filters, sortBy, reset: false }));
    }
  }, [dispatch, filters, sortBy, loading, hasMore]);

  // Apply filters
  const applyFilters = useCallback(
    (newFilters: FilterOptions) => {
      dispatch(setFilters(newFilters));
      dispatch(clearMissions());
      dispatch(fetchMissions({ filters: newFilters, sortBy, reset: true }));
    },
    [dispatch, sortBy]
  );

  // Apply sort
  const applySort = useCallback(
    (newSortBy: SortOption) => {
      dispatch(setSortBy(newSortBy));
      dispatch(clearMissions());
      dispatch(fetchMissions({ filters, sortBy: newSortBy, reset: true }));
    },
    [dispatch, filters]
  );

  // Get mission by ID
  const getMissionById = useCallback(
    (missionId: string) => {
      return dispatch(fetchMissionById(missionId));
    },
    [dispatch]
  );

  // Toggle favorite
  const handleToggleFavorite = useCallback(
    (missionId: string) => {
      dispatch(toggleFavorite(missionId));
    },
    [dispatch]
  );

  // Register for mission
  const handleRegisterForMission = useCallback(
    (missionId: string) => {
      dispatch(registerForMission(missionId));
    },
    [dispatch]
  );

  // Unregister from mission
  const handleUnregisterFromMission = useCallback(
    (missionId: string) => {
      dispatch(unregisterFromMission(missionId));
    },
    [dispatch]
  );

  // Check if user is registered for a mission
  const isRegisteredForMission = useCallback(
    (missionId: string) => {
      return registeredMissionIds.includes(missionId);
    },
    [registeredMissionIds]
  );

  return {
    missions,
    favorites,
    registeredMissionIds,
    loading,
    error,
    hasMore,
    filters,
    sortBy,
    refreshMissions,
    loadMoreMissions,
    applyFilters,
    applySort,
    getMissionById,
    toggleFavorite: handleToggleFavorite,
    registerForMission: handleRegisterForMission,
    unregisterFromMission: handleUnregisterFromMission,
    isRegisteredForMission,
  };
};
