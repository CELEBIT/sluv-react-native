import notifee, {AndroidImportance} from '@notifee/react-native';
import {REACT_APP_WEB} from '@env';

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
    data: message.data,
  });
};

export default {
  displayNoti: (remoteMessage: any) => displayNotification(remoteMessage),
};

export const convertPushUrl = (data: any) => {
  switch (data.type) {
    case 'item': {
      return `${REACT_APP_WEB}item/detail/${data.itemId}`;
    }
    case 'community': {
      return `${REACT_APP_WEB}community/detail/${data.communityId}`;
    }
    case 'user': {
      return `${REACT_APP_WEB}user/${data.userId}`;
    }
    case 'comment': {
      return `${REACT_APP_WEB}community/detail/${data.communityId}`;
    }
    case 'report': {
      return `${REACT_APP_WEB}item/detail/${data.itemId}`;
    }
    case 'edit': {
      return `${REACT_APP_WEB}item/detail/${data.itemId}`;
    }
    default:
      return REACT_APP_WEB;
  }
};
