import React from 'react';
import {
  Linking,
  View,
  Button,
  AsyncStorage
} from 'react-native';
import qs from 'query-string';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  async componentDidMount() {
    await this.obtainCsrfToken()
    const url = await Linking.getInitialURL()
    if (url) this.getAccessToken(url)
  }

  async getAccessToken(url) {
    const params = qs.parse(url.split('?')[1])
    const code = params.code
    const state = params.state

    if (this.state.csrfToken === state) {
      const body = qs.stringify({
        grant_type: 'authorization_code',
        client_id: 'nprone_trial_NDez2fJ7qASv',
        client_secret: '3Qcafw9osRpK8Rf6sgAvhl9xlYFm4269VlkxGUn1',
        code: code,
        redirect_uri: 'nprone://authorize'
      })

      try {
        const response = await fetch('https://api.npr.org/authorization/v2/token', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: body
        })
        const token = await response.json();
        console.log(token)
        this.setState({ token: token })
      } catch (error) {
        console.error(error)
      }
    } else {
      console.error('State does not match.')
    }
  }

  async generateCsrfToken() {
    const csrfToken = Math.random().toString(36).substring(2)
    try {
      await AsyncStorage.setItem('@NPROneStore:CSRF_TOKEN', csrfToken);
    } catch (error) {
      console.error(error)
    }
  }

  async obtainCsrfToken() {
    try {
      const value = await AsyncStorage.getItem('@NPROneStore:CSRF_TOKEN');
      if (value !== null) {
        this.setState({ csrfToken: value })
      } else {
        await this.generateCsrfToken()
      }
    } catch (error) {
      console.error(error)
    }
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View>
        <Button
          onPress={() => navigate('Login')}
          title="Login"
        />
      </View>
    )
  }
}