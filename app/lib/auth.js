import { AsyncStorage } from "react-native";
import qs from 'query-string'

export const AUTHENTICATED = "@NPROneStore:AUTHENTICATED";
// export const CSRF_TOKEN = Math.random().toString(36).substring(2)
export const CSRF_TOKEN = 'pbfp3cs52s'
const ACCESS_TOKEN = '@NPROneStore:ACCESS_TOKEN'

export const signIn = () => AsyncStorage.setItem(AUTHENTICATED, 'true')

export const signOut = () => AsyncStorage.removeItem(AUTHENTICATED)

export const setAccessToken = (token) => AsyncStorage.setItem(ACCESS_TOKEN, JSON.stringify(token))

export const getAccessToken = async () => {
  try {
    const accessToken = await AsyncStorage.getItem(ACCESS_TOKEN)
    return JSON.parse(accessToken)
  } catch (err) {
    console.log(err)
  }
}

export const isSignedIn = async () => {
  try {
    const res = await AsyncStorage.getItem(AUTHENTICATED)
    return res !== null
  } catch (err) {
    console.error(err)
  }
}

export const exchangeToken = async (url) => {
  const params = qs.parse(url.split('?')[1])
  const code = params.code
  const state = params.state

  if (CSRF_TOKEN !== state) {
    console.error(`Expected: ${CSRF_TOKEN}\nActual: ${state}`)
  }

  const body = qs.stringify({
    grant_type: 'authorization_code',
    client_id: 'nprone_trial_NDez2fJ7qASv',
    client_secret: '3Qcafw9osRpK8Rf6sgAvhl9xlYFm4269VlkxGUn1',
    code: code,
    redirect_uri: 'com.nprone://authorize'
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
    return token
  } catch (error) {
    console.error(error)
  }
}

export const generateAuthUri = () => {
  const params = qs.stringify({
    client_id: 'nprone_trial_NDez2fJ7qASv',
    state: CSRF_TOKEN,
    redirect_uri: 'com.nprone://authorize',
    response_type: 'code',
    scope: 'listening.readonly'
  })
  return `https://api.npr.org/authorization/v2/authorize?${params}`
}