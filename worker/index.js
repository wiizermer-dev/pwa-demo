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

/** 
 * 在 onBackgroundMessage 做訊息客製化，會顯示兩封通知於通知列(1客製、1預設(無法移除))
 * https://github.com/firebase/quickstart-js/issues/126#issuecomment-907003970
 */

 messaging.onBackgroundMessage((payload) => {
  console.info('[onBackgroundMessage received]', payload)
  const { title, body } = payload?.notification || {}
  const notificationTitle = `${title || 'Notification'}`
  const notificationOptions = {
    body: `${body + '嗨嗨今天好嗎？'}`,
    icon: '/icons/icon-32x32.png',
    tag: 'onBackgroundMessage',
  }
  self.registration.showNotification(notificationTitle, notificationOptions)
  // Schedule closing all notifications that are not our own.
  // This is necessary because if we don't close the other notifications the
  // default one will appear and we will have duplicate notifications.
  return new Promise(function (resolve, reject) {
    resolve()
  })
})

self.addEventListener('push', function (event) {
  console.info('[push received]', event)
  event.waitUntil(self.registration.showNotification('TITLE, push'))
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
