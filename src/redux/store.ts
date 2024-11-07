import { combineReducers, createStore } from 'redux'
import { isGameActiveReducer, matchesReducer, socketReducer, userReducer } from './reducers';

const reducers = combineReducers({
    socket: socketReducer,
    user: userReducer,
    matches: matchesReducer,
    isGameActive: isGameActiveReducer
})

export const store = createStore(reducers);

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch