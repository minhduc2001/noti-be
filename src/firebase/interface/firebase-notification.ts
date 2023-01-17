export interface IFirebaseSendNotification {
  body?: string;
  title?: string;
  token: string;
}

export interface IFirebaseSendNotificationGroupDevices {
  body?: string;
  title?: string;
  registrationTokens?: string[];
  notification_key?: string;
  notification_key_name?: string;
}
