import { combineReducers, applyMiddleware, createStore } from 'redux'
import thunk from 'redux-thunk'
import { createWrapper } from 'next-redux-wrapper'
import { appStoreReducer } from './appstore/reducer'

const combineReducer = combineReducers({
   appStore: appStoreReducer
})

const bindMiddleWare = function (middleware) {
   // if (process.env.NODE_ENV !== 'production') {
      const { composeWithDevTools } = require('redux-devtools-extension')
      return composeWithDevTools(applyMiddleware(...middleware))
   // }
   return applyMiddleware(...middleware)
}

const makeStore = function ({isServer}) {
   if (isServer) {
      return createStore(combineReducer, bindMiddleWare([thunk]))
   }
   const { persistStore, persistReducer } = require('redux-persist')
   const storage = require('redux-persist/lib/storage').default
   const persistConfig = {
      key: 'chat',
      whitelist: ['appStore'],
      storage: storage
   }
   const persistedReducer = persistReducer(persistConfig, combineReducer)
   const store = createStore(persistedReducer, bindMiddleWare([thunk]))
   store.__persistor = persistStore(store)
   return store
}

export default createWrapper(makeStore)