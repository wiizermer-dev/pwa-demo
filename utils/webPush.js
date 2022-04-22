import { initializeApp } from 'firebase/app'
import { getMessaging, getToken } from 'firebase/messaging'
import localforage from 'localforage'

const clientCredentials = {
  apiKey: "AIzaSyBgQe3eswlSvWDe5-TlCODgkK5Un-TDAcE",
  authDomain: "nsfw-6df75.firebaseapp.com",
  projectId: "nsfw-6df75",
  storageBucket: "nsfw-6df75.appspot.com",
  messagingSenderId: "611194628487",
  appId: "1:611194628487:web:2bfd22f74e2ecc508a0b22",
  measurementId: "G-3HW9VFLPRX"
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
    console.warn(e)
  }
}

const firebaseCloudMessaging = {
  // checking whether token is available in indexed DB
  tokenInlocalforage: async () => localforage.getItem('fcm_token'),
  // initializing firebase app
  init: async () => {
    const app = initializeApp(clientCredentials)
    const messaging = getMessaging(app)
    try {
      const registration = await swReady() 
      await Notification.requestPermission()
      const tokenInLocalForage = await firebaseCloudMessaging.tokenInlocalforage()
      const token =
        tokenInLocalForage ||
        (await getToken(messaging, {
          serviceWorkerRegistration: registration,
          vapidKey: 'BO3uWIrFO0H5Z9GMxiRi3snDiQM4A7vQ6pWu5zocaTIiJdG02a0vgZGUpW3t66_y6p3tLq7cRGdeFmThWvH4CKE',
        }))
      if (token) localforage.setItem('fcm_token', token)
      return { token, messaging }
    } catch (error) {
      console.error(error)
      return null
    }
  },
}
export { firebaseCloudMessaging }
