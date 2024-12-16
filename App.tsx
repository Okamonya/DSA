import React from 'react';
import { Provider } from 'react-redux';
import store from './src/redux/features/store';
import AppNavigator from './src/router/AppRouter';

export default function App() {
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
}
