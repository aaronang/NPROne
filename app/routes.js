import { StackNavigator } from 'react-navigation';

import Welcome from './screens/Welcome';
import Login from './screens/Login';
import Play from './screens/Play';

export const SignedOut = StackNavigator({
  Welcome: {
    screen: Welcome
  },
  Login: {
    screen: Login
  }
});

export const SignedIn = StackNavigator({
  Play: {
    screen: Play
  }
});

export const createRootNavigation = (authenticated = false) => {
  return StackNavigator(
    {
      SignedIn: {
        screen: SignedIn,
        navigationOptions: {
          gesturesEnabled: false
        }
      },
      SignedOut: {
        screen: SignedOut,
        navigationOptions: {
          gesturesEnabled: false
        }
      }
    },
    {
      headerMode: 'none',
      mode: 'modal',
      initialRouteName: authenticated ? 'SignedIn' : 'SignedOut'
    }
  );
};
