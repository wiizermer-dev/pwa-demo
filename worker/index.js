import { initializeApp } from 'firebase/app'
import { getMessaging, onBackgroundMessage } from 'firebase/messaging/sw'

/**
 * referrence doc:
 * https://github.com/vercel/next.js/blob/main/examples/with-firebase-cloud-messaging/public/firebase-messaging-sw.js
 */

const firebaseApp = initializeApp({
  apiKey: "AIzaSyBgQe3eswlSvWDe5-TlCODgkK5Un-TDAcE",
  authDomain: "nsfw-6df75.firebaseapp.com",
  projectId: "nsfw-6df75",
  storageBucket: "nsfw-6df75.appspot.com",
  messagingSenderId: "611194628487",
  appId: "1:611194628487:web:2bfd22f74e2ecc508a0b22",
  measurementId: "G-3HW9VFLPRX"
})

const messaging = getMessaging(firebaseApp)

self.addEventListener('install', event => {
  event.waitUntil(self.skipWaiting());
  console.log("install, activate");
})

/** 
 * 在 onBackgroundMessage 做訊息客製化，會顯示兩封通知於通知列(1客製、1預設(無法移除))
 * https://github.com/firebase/quickstart-js/issues/126#issuecomment-907003970
 */

onBackgroundMessage(messaging, (payload) => {
  // self.registration.hideNotification()
  console.info('[onBackgroundMessage received]', payload)
  // const { title, body } = payload?.notification || {}
  // const notificationTitle = `${title || 'Notification'}`
  // const notificationOptions = {
  //   body: `${body + '嗨嗨今天好嗎？'}`,
  //   icon: '/icons/icon-32x32.png',
  //   tag: 'onBackgroundMessage',
  // }
  // // self.registration.showNotification(notificationTitle, notificationOptions)
  // // setTimeout(function () {
  // // }, 10);
  // // Schedule closing all notifications that are not our own.
  // // This is necessary because if we don't close the other notifications the
  // // default one will appear and we will have duplicate notifications.
  return new Promise(function (resolve, reject) {
    resolve();
    // setTimeout(function () {
    //   self.registration.getNotifications().then((notifications) => {
    //     notifications.forEach((notification) => {
    //       if (notification.tag !== 'onBackgroundMessage') {
    //         notification.close();
    //       }
    //     });
    //   });
    // }, 10);
  });
})

self.addEventListener('push', function (event) {
  console.info('[push received]', event)
  const promise = self.registration.showNotification('PUSH')
  event.waitUntil(promise)
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
