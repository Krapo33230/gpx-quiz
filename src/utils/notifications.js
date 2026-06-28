import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge:  false,
  }),
});

export async function requestAndScheduleDailyNotif(hour = 19) {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') return false;

  await Notifications.cancelAllScheduledNotificationsAsync();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🚔 [Ordre de Mission] ConcoursPolice',
      body:  "Recrue, votre session d'entraînement quotidienne est prête. Présence requise.",
    },
    trigger: { hour, minute: 0, repeats: true },
  });

  return true;
}

export async function cancelDailyNotif() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
