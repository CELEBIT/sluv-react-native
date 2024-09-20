import notifee, {AndroidImportance} from '@notifee/react-native';

const displayNotification = async (message: any) => {
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
      pressAction: {
        id: '스럽',
      },
    },
  });
};

export default {
  displayNoti: (remoteMessage: any) => displayNotification(remoteMessage),
};

export const convertPushUrl = (remoteMessage: any) => {
  switch (remoteMessage.data.type) {
    case 'item': {
      console.log('break');
      return `item/detail/${remoteMessage.data.itemId}`;
    }
    case 'community': {
      return `community/detail/${remoteMessage.data.communityId}`;
    }
    case 'user': {
      return `user/${remoteMessage.data.userId}`;
    }
    case 'comment': {
      return `community/detail/${remoteMessage.data.communityId}`;
    }
    case 'report': {
      return `item/detail/${remoteMessage.data.itemId}`;
    }
    case 'edit': {
      return `item/detail/${remoteMessage.data.itemId}`;
    }
    default:
      return '';
  }
};
