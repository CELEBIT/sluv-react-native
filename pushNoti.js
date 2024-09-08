import notifee, {AndroidImportance} from '@notifee/react-native';

const displayNotification = async message => {
  await notifee.createChannel({
    id: '스럽',
    name: '스럽',
    importance: AndroidImportance.HIGH,
  });

  await notifee.displayNotification({
    title: message.notification.title,
    body: message.notification.body,
    android: {
      channelId: '스럽',
      smallIcon: 'ic_stat_app_icon_square',
      color: '#6C47FF',
    },
  });
};

export default {
  displayNoti: remoteMessage => displayNotification(remoteMessage),
};
