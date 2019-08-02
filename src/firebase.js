import firebase from 'firebase/app'
import 'firebase/app'
import 'firebase/database'
import 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyDXOhsMApAfBZhl00CUKQoM70G_fFWFKJ8',
  authDomain: 'm-city-75660.firebaseapp.com',
  databaseURL: 'https://m-city-75660.firebaseio.com',
  projectId: 'm-city-75660',
  storageBucket: '',
  messagingSenderId: '241409887742',
  appId: '1:241409887742:web:234963234d7287a9',
}
// Initialize Firebase
firebase.initializeApp(firebaseConfig)

const firebaseDB = firebase.database()
const firebaseMatches = firebaseDB.ref('matches')
const firebasePromotions = firebaseDB.ref('promotions')
const firebaseTeams = firebaseDB.ref('teams')

export {
  firebase,
  firebaseMatches,
  firebasePromotions,
  firebaseTeams,
  firebaseDB,
}
