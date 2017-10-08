import React from 'react'
import { View, Text } from 'react-native'
import { isSignedIn } from './lib/auth'
import { createRootNavigation } from './routes'

export default class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      authenticated: false,
      loading: true
    }
  }

  async componentWillMount() {
    this.checkAuth()
  }

  async checkAuth() {
    try {
      const authenticated = await isSignedIn()
      this.setState({ authenticated: authenticated, loading: false })
    } catch (err) {
      console.error(err)
    }
  }

  render() {
    if (this.state.loading) {
      return <View><Text>Loading...</Text></View>
    }

    const Layout = createRootNavigation(this.state.authenticated)
    return <Layout screenProps={{ checkAuth: () => this.checkAuth() }} />
  }
}
