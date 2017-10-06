import { StackNavigator } from 'react-navigation';
import HomeScreen from './HomeScreen'
import LoginScreen from './LoginScreen'

const App = StackNavigator({
  Home: { screen: HomeScreen },
  Login: { screen: LoginScreen }
});

export default App;