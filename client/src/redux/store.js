import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./features/auth.slice";
import { api } from "./api/appSlice";

const persistConfig = { storage };

const createPersistedReducer = (key, reducer) =>
  persistReducer({ ...persistConfig, key }, reducer);

const store = configureStore({
  reducer: {
    auth: createPersistedReducer("auth", authReducer),
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }).concat(api.middleware),
});

const persistor = persistStore(store);

export { persistor, store };
