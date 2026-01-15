// src/redux-store/store.ts
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import createIdbStorage from "redux-persist-indexeddb-storage";

import { baseApi } from "./services/baseApi";
import authReducer from "./slices/authSlice";
import editorReducer from "./slices/editorSlice";
import uiReducer from "./slices/uiSlice";
import adminAuthReducer from "./slices/adminAuthSlice";

export type { AuthState } from "./slices/authSlice";
export type { AdminAuthState } from "./slices/adminAuthSlice";
export type { EditorState } from "./slices/editorSlice";
export type { UIState } from "./slices/uiSlice";

const indexedDBStorage = createIdbStorage("scanfleet-db");

const persistConfig = {
  key: "root",
  version: 1,
  storage: indexedDBStorage,
  whitelist: ["auth", "adminAuth"],
};

const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  auth: authReducer,
  adminAuth: adminAuthReducer,
  editor: editorReducer,
  ui: uiReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(baseApi.middleware),
});

export const persistor = persistStore(store);

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
