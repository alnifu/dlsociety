import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AppContextProvider, AppContext } from './context/AppContext';
import TabNavigator from './navigation/TabNavigator';
import AuthNavigator from './navigation/AuthNavigator';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

const RootNavigator = () => {
  const { user } = useContext(AppContext);
  return user ? <TabNavigator /> : <AuthNavigator />;
};

export default function App() {
  return (
    <AppContextProvider>
      <SafeAreaView style={{ flex: 1, marginTop: StatusBar.currentHeight, paddingBottom: 6 }}>
      <NavigationContainer>
        <StatusBar style="light" backgroundColor="green" />
        <RootNavigator />
      </NavigationContainer>
      </SafeAreaView>
    </AppContextProvider>
  );
}
