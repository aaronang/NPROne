import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { isSignedIn } from './lib/auth';
import { createRootNavigation } from './routes';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      authenticated: false,
      loading: true
    };
  }

  async componentWillMount() {
    this._checkAuth();
  }

  _checkAuth = async () => {
    try {
      const authenticated = await isSignedIn();
      this.setState({ authenticated: authenticated, loading: false });
    } catch (err) {
      console.error(err);
    }
  };

  render() {
    if (this.state.loading) {
      return (
        <View style={styles.container}>
          <Text>Loading...</Text>
        </View>
      );
    }

    const Layout = createRootNavigation(this.state.authenticated);
    return <Layout screenProps={{ checkAuth: () => this._checkAuth() }} />;
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 50
  }
});
