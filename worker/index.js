import { initializeApp } from 'firebase/app'
import { getMessaging, onBackgroundMessage } from 'firebase/messaging/sw'

/**
 * referrence doc:
 * https://github.com/vercel/next.js/blob/main/examples/with-firebase-cloud-messaging/public/firebase-messaging-sw.js
 */

const firebaseApp = initializeApp({
  apiKey: 'AIzaSyDA1Eb5QQVZLzwYji4qXhrYF-PkdHDBuVY',
  authDomain: 'sw-notify-trial.firebaseapp.com',
  projectId: 'sw-notify-trial',
  storageBucket: 'sw-notify-trial.appspot.com',
  messagingSenderId: '120666291064',
  appId: '1:120666291064:web:6e64186919305022a2a68d',
})


const messaging = getMessaging(firebaseApp)
console.log(messaging)
onBackgroundMessage(messaging, (payload) => {
  self.registration.hideNotification()
  console.info('[onBackgroundMessage received]', payload)
  const { title, body } = payload?.notification || {}
  const notificationTitle = `${title || 'Notification'}`
  const notificationOptions = {
    body: `：${'嗨嗨今天好嗎？'}`,
    icon: '/icons/icon-32x32.png',
    tag: 'TEST NOTIFY',
  }
  self.registration.showNotification(notificationTitle, notificationOptions)
  return false
})
/**
 * ref doc: https://web.dev/push-notifications-handling-messages/
 */
self.addEventListener('push', event => {
  console.info('[event received]', event)
  event.preventDefault()
  const message = event?.data?.json()
  const { title, body } = message?.notification || {}
  const notificationTitle = `${title || 'Notification'}`
  const notificationOptions = {
    body: 'PUSHSHSHSH',
    icon: '/icons/icon-32x32.png',
    tag: 'TEST NOTIFY',
  }
  const promiseChain = self.registration.showNotification(notificationTitle, notificationOptions)
  event.waitUntil(promiseChain)
})

self.addEventListener('notificationclick', event => {
  console.info('On notification click: ', event.notification.tag)
  event.notification.close()
  // This looks to see if the current is already open and
  // focuses if it is
  event.waitUntil(
    self.clients
      .matchAll({
        type: 'window',
      })
      .then(clientList => {
        for (let i = 0; i < clientList.length; i += 1) {
          const client = clientList[i]
          if (client.url === '/' && 'focus' in client) return client.focus()
        }
        if (self.clients.openWindow) return self.clients.openWindow('/')
      })
  )
})
