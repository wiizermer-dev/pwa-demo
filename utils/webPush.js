import { initializeApp } from 'firebase/app'
import { getMessaging, getToken } from 'firebase/messaging'
import localforage from 'localforage'

const clientCredentials = {
  apiKey: 'AIzaSyDA1Eb5QQVZLzwYji4qXhrYF-PkdHDBuVY',
  authDomain: 'sw-notify-trial.firebaseapp.com',
  projectId: 'sw-notify-trial',
  storageBucket: 'sw-notify-trial.appspot.com',
  messagingSenderId: '120666291064',
  appId: '1:120666291064:web:6e64186919305022a2a68d',
}

/**
 * referrence doc: https://github.com/vercel/next.js/blob/main/examples/with-firebase-cloud-messaging/utils/webPush.js
 */

async function swReady() {
  try {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready
      return registration
    }
    return null
  } catch (e) {
    logger.error(e)
    return null
  }
}

const firebaseCloudMessaging = {
  // checking whether token is available in indexed DB
  tokenInlocalforage: async () => localforage.getItem('fcm_token'),
  // initializing firebase app
  init: async () => {
    try {
      const registration = await swReady() 

      const app = initializeApp(clientCredentials)
      const messaging = getMessaging(app)
      const tokenInLocalForage = await firebaseCloudMessaging.tokenInlocalforage()
      await Notification.requestPermission()
      const token =
        tokenInLocalForage ||
        (await getToken(messaging, {
          serviceWorkerRegistration: registration,
          vapidKey: 'BL70XipL944PGN_M3bDa130ZfKEB9pZjoKy9wZ5-Ch_7BetlDCLE8a3_7BAK_c3dSpvS-TwJ8u7U3w4AUBLf73I',
        }))
      if (token) {
        localforage.setItem('fcm_token', token)
        return { token, messaging }
      }
      return null
    } catch (error) {
      console.error(error)
      return null
    }
  },
}
export { firebaseCloudMessaging }
