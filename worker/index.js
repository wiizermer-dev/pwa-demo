importScripts('https://www.gstatic.com/firebasejs/9.2.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/9.2.0/firebase-messaging-compat.js')

/**
 * referrence doc:
 * https://github.com/vercel/next.js/blob/main/examples/with-firebase-cloud-messaging/public/firebase-messaging-sw.js
 */

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyBgQe3eswlSvWDe5-TlCODgkK5Un-TDAcE",
  authDomain: "nsfw-6df75.firebaseapp.com",
  projectId: "nsfw-6df75",
  storageBucket: "nsfw-6df75.appspot.com",
  messagingSenderId: "611194628487",
  appId: "1:611194628487:web:2bfd22f74e2ecc508a0b22",
  measurementId: "G-3HW9VFLPRX"
})

const messaging = firebase.messaging(firebaseApp)

messaging.onBackgroundMessage((payload) => {
  console.info('[onBackgroundMessage received]', payload)
  const { title, body } = payload?.notification || {}
  const notificationTitle = `onBackgroundMessage`
  const notificationOptions = {
    body: `這裡是 fcm onBackgroundMessage`,
    icon: '/icons/icon-32x32.png',
    tag: 'onBackgroundMessage',
  }
  self.registration.showNotification(notificationTitle, notificationOptions)
})

self.addEventListener('push', function (event) {
  console.info('[push received]', event)
  event.waitUntil(self.registration.showNotification('PUSH event handle', { body: '這裡是 self push event'}))
  // event.waitUntil(self.registration.showNotification('TITLE, push'))
})


self.addEventListener('notificationclick', function (event) {
  console.info('[notificationclick received]', event)
  event.notification.close()
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
      if (clientList.length > 0) {
        let client = clientList[0]
        for (let i = 0; i < clientList.length; i++) {
          if (clientList[i].focused) {
            client = clientList[i]
          }
        }
        return client.focus()
      }
      return clients.openWindow('/')
    })
  )
})
