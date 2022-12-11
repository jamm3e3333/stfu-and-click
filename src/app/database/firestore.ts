import * as firebase from 'firebase-admin'
import config from '../../config'

firebase.initializeApp({
  credential: firebase.credential.cert(config.firebase.serviceAccount),
})

export default firebase.firestore()

export const getDataFromQuerySnapshots = async <T>(
  snapshots: Promise<FirebaseFirestore.QuerySnapshot>
) => {
  return (await snapshots).docs.map(x => ({
    id: x.id,
    ...x.data(),
  })) as T[]
}