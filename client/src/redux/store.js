import { configureStore } from '@reduxjs/toolkit'
import feStateReducer from './feState'

export default configureStore({
    reducer: {
        feState: feStateReducer
    }
})