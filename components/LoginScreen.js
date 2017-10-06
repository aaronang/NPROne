import React from 'react'
import qs from 'query-string'
import { WebView } from 'react-native';

export default class LoginScreen extends React.Component {
  generateState() {
    return Math.random().toString(36).substring(2)
  }

  generateAuthUri() {
    const params = qs.stringify({
      client_id: 'nprone_trial_NDez2fJ7qASv',
      state: this.generateState(),
      redirect_uri: 'nprone://authorize',
      response_type: 'code',
      scope: 'listening.readonly'
    })
    return `https://api.npr.org/authorization/v2/authorize?${params}`
  }

  render() {
    return (
      <WebView source={{ uri: this.generateAuthUri() }} />
    );
  }
}