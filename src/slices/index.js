import { combineReducers } from 'redux';

import contactReducer from './contacts'
import locationReducer from './location'

const rootReducer = combineReducers({
    contacts: contactReducer,
    location: locationReducer
})

export default rootReducer