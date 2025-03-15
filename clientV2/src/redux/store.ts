import { configureStore } from '@reduxjs/toolkit'
import feStateReducer from './feState'
import connectionStateReducer from './connectionState'

export default configureStore({
    reducer: {
        feState: feStateReducer,
        connectionState: connectionStateReducer,
    },
})
