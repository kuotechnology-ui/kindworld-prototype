import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import dashboardReducer from './slices/dashboardSlice'
import missionsReducer from './slices/missionsSlice'
import vouchersReducer from './slices/vouchersSlice'
import profileReducer from './slices/profileSlice'
import languageReducer from './slices/languageSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    missions: missionsReducer,
    vouchers: vouchersReducer,
    profile: profileReducer,
    language: languageReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
