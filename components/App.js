import React, { Component } from 'react';
import {
  WebView,
  Linking
} from 'react-native';
import qs from 'query-string';

export default class App extends Component {
  constructor(props) {
    super(props)
  }

  generateState() {
    const state = Math.random().toString(36).substring(2)
    return state
  }

  async componentDidMount() {
    const url = await Linking.getInitialURL()
    if (url) this.getAccessToken(url)
  }

  async getAccessToken(url) {
    const params = qs.parse(url.split('?')[1])
    const code = params.code
    const state = params.state
    const body = qs.stringify({
      grant_type: 'authorization_code',
      client_id: 'nprone_trial_NDez2fJ7qASv',
      client_secret: '3Qcafw9osRpK8Rf6sgAvhl9xlYFm4269VlkxGUn1',
      code: code,
      redirect_uri: 'nprone://oauth'
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
    } catch (error) {
      console.error(error)
    }
  }

  generateAuthUri() {
    const params = qs.stringify({
      client_id: 'nprone_trial_NDez2fJ7qASv',
      state: this.generateState(),
      redirect_uri: 'nprone://oauth',
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
