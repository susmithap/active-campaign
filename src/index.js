import React from 'react';
import {render} from 'react-dom';
import {configureStore} from '@reduxjs/toolkit'
import { Provider } from 'react-redux';

import App from './App';
import rootReducer from './slices';

const store = configureStore({reducer: rootReducer})

render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
