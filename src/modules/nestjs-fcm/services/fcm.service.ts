import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { Inject, Logger } from '@nestjs/common';
import { FCM_OPTIONS } from '../fcm.constants';
import { FcmOptions } from '../interfaces/fcm-options.interface';
import * as firebaseAdmin from 'firebase-admin';
import { MessagingTopicResponse } from 'firebase-admin/lib/messaging/messaging-api';

@Injectable()
export class FcmService {
  constructor(
    @Inject(FCM_OPTIONS) private fcmOptionsProvider: FcmOptions,
    private readonly logger: Logger,
  ) { }

  initFirebase() {
    firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.cert(
        this.fcmOptionsProvider.firebaseSpecsPath
      ),
    });
  }

  subscribeToTopic(deviceIds: Array<string>, topic: string) {
    if (deviceIds.length == 0) {
      return null;
    }

    if (firebaseAdmin.apps.length === 0) {
      this.initFirebase();
    }
    console.log("subscribeToTopic=" + topic, deviceIds)
    return firebaseAdmin.messaging().subscribeToTopic(deviceIds, topic);
  }

  async sendNotification(
    payload: firebaseAdmin.messaging.MessagingPayload,
    silent: boolean,
    topic?: string,
    deviceIds?: Array<string>,
    imageUrl?: string
  ) {
    if (!topic && deviceIds?.length == 0) {
      throw new Error('You provide an empty device ids list!');
    }

    if (firebaseAdmin.apps.length === 0) {
      this.initFirebase();
    }

    const body: firebaseAdmin.messaging.TopicMessage = {
      data: payload?.data,
      notification: {
        title: payload?.notification?.title,
        body: payload?.notification?.body,
        imageUrl
      },
      topic,
      apns: {
        payload: {
          aps: {
            sound: payload?.notification?.sound,
            contentAvailable: silent ? true : false,
            mutableContent: true
          }
        },
        fcmOptions: {
          imageUrl
        }
      },
      android: {
        priority: 'high',
        ttl: 60 * 60 * 24,
        notification: {
          sound: payload?.notification?.sound
        }
      }
    }

    let result = null
    let failureCount = 0
    let successCount = 0
    const failedDeviceIds = []

    if (!deviceIds) {
      return firebaseAdmin.messaging().sendToTopic("all", {
        notification: {
          body: payload.notification.body,
          title: payload?.notification?.title,
        }
      })
    }

    while (deviceIds.length) {
      try {
        result = await firebaseAdmin
          .messaging()
          .sendMulticast({ ...body, tokens: deviceIds.splice(0, 500) }, false)
        if (result.failureCount > 0) {
          const failedTokens = [];
          result.responses.forEach((resp, id) => {
            if (!resp.success) {
              failedTokens.push(deviceIds[id]);
            }
          });
          failedDeviceIds.push(...failedTokens)
        }
        failureCount += result.failureCount;
        successCount += result.successCount;
      } catch (error) {
        this.logger.error(error.message, error.stackTrace, 'nestjs-fcm');
        throw error;
      }

    }
    return { failureCount, successCount, failedDeviceIds };
  }
}
