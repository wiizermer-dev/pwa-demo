import { useEffect, useState } from 'react'

import Head from 'next/head'

import '../styles/globals.css'
import styles from '../styles/Home.module.css'
import { onMessage } from 'firebase/messaging'
import { firebaseCloudMessaging } from '../utils/webPush'

async function fcmForegroundHandle(setFcmToken) {
  try {
    const { token, messaging } = await firebaseCloudMessaging.init()
    console.log({ token, messaging })
    if (token) {
      setFcmToken(token)
      onMessage(messaging, message => {
        console.info('foreground ', message)
        const { title, body } = message.notification
        window.alert(title, body)
      })
    }
  } catch (error) {
    console.info(error)
  }
}


export default function MyApp({ Component, pageProps }) {
  
  const [fcmToken, setFcmToken] = useState('')
  useEffect(() => {
    fcmForegroundHandle(setFcmToken)
  }, [])

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
        />
        <meta name="description" content="Description" />
        <meta name="keywords" content="Keywords" />
        <title>Next.js PWA Example</title>

        <link rel="manifest" href="/manifest.json?v=2" />
        <link
          href="/icon.png"
          rel="icon"
          type="image/png"
          sizes="16x16"
        />
        <link
           href="/icon.png"
          rel="icon"
          type="image/png"
          sizes="32x32"
        />
        <link rel="apple-touch-icon" href="/apple-icon.png"></link>
        <meta name="theme-color" content="#317EFB" />
      </Head>
      <p className={styles.description}>
          fcmToken: {fcmToken}
      </p>
      {fcmToken && <p className={styles.description}>
        Current view: {window?.matchMedia('(display-mode: standalone)').matches ? 'PWA' : 'Browser'}
      </p>}
      <Component {...pageProps} />
    </>
  )
}
