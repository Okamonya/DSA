import React from 'react';
import { Provider } from 'react-redux';
import store from './src/redux/features/store';
import AppNavigator from './src/router/AppRouter';
import { PaperProvider } from 'react-native-paper';
import LoadingOverlay from './src/components/loader/LoaderOverlay';

export default function App() {
  return (
    <Provider store={store}>
      <PaperProvider>
        <LoadingOverlay />
        <AppNavigator />
      </PaperProvider>
    </Provider>
  );
}
