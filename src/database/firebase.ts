import * as firebase from 'firebase-admin'
import config from '../config'

firebase.initializeApp({
  credential: config.firebase.serviceAccount,
  databaseURL: config.firebase.databaseUrl,
})

export default firebase
