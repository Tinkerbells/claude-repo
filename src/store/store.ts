import storage from 'redux-persist/lib/storage'
import { useDispatch, useSelector } from 'react-redux'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist'

import { olapApi } from '../api/apiSlice'
import tableForTablesSlice from './features/tableForTable/tableForTableSlice'
import olapReposrtsPagesSlice from './features/olapReposrtsPagesSlice/olapReposrtsPagesSlice'

const persistConfig = {
  key: 'root', // ключ для localStorage
  storage, // используем localStorage
  whitelist: ['tableForTables', 'olapReportsPages'], // какие редюсеры сохранять (можно исключить API)
}

// Объединяем редюсеры
const rootReducer = combineReducers({
  tableForTables: tableForTablesSlice,
  olapReportsPages: olapReposrtsPagesSlice,
  [olapApi.reducerPath]: olapApi.reducer,
})

// Оборачиваем редюсер в persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer)

// Создаем store с persistedReducer
export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER], // игнорируем действия redux-persist
      },
    }).concat(olapApi.middleware),
})

// Создаем persistor для работы с PersistGate
export const persistor = persistStore(store)

// Типы для TypeScript
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// Типизированные хуки
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
