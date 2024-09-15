import {
  combineReducers,
  configureStore,
} from '@reduxjs/toolkit';
import {persistStore, persistReducer} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import auth from './authSlice';
import  music  from './music-store';
import updatedMusicStore from './updated-music-store';
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
const persistConfig = {
  key: 'syn_or_stream',
  whitelist: ['auth','music'],
  storage,
};

const reducers = combineReducers({
    auth,
    music,
    updatedMusicStore
})

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
});



const persistorStore = persistStore(store);
export {store, persistorStore};
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
