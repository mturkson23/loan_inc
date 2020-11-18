import { useState } from 'react';
import { Plugins, PushNotification, PushNotificationToken, PushNotificationActionPerformed } from '@capacitor/core';
const { PushNotifications } = Plugins;
// import usePrevious from './usePrevious';

const Push =()=> {
  const [notifications, setNotifications] = useState({});
  // const previousNotification = usePrevious(notifications);
  // Register with Apple / Google to receive push via APNS/FCM
  PushNotifications.register();

  // On succcess, we should be able to receive notifications
  PushNotifications.addListener('registration',
    (token: PushNotificationToken) => {
      alert('Push registration success, token: ' + token.value);
    }
  );

  // Some issue with your setup and push will not work
  PushNotifications.addListener('registrationError',
    (error: any) => {
      alert('Error on registration: ' + JSON.stringify(error));
    }
  );

  // Show us the notification payload if the app is open on our device
  PushNotifications.addListener('pushNotificationReceived',
    (notification: PushNotification) => {
      let notif = notifications;
      // notifications?.push({ id: notification.id, title: notification.title, body: notification.body })
      setNotifications({id: notification.id, title: notification.title, body: notification.body})
    }
  );

  // Method called when tapping on a notification
  PushNotifications.addListener('pushNotificationActionPerformed',
    (notification: PushNotificationActionPerformed) => {
      let notif = notifications;
      // notif.push({ id: notification.notification.data.id, title: notification.notification.data.title, body: notification.notification.data.body })
      setNotifications(
        { id: notification.notification.data.id, title: notification.notification.data.title, body: notification.notification.data.body }
      )
    }
  );
}

export default Push;