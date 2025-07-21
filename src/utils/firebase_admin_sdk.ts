import firebaseAdmin, { type ServiceAccount } from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

const CERT = process?.env?.VIDUR_FIREBASE_SERVICE_ACC_PRIVATE_KEY?.replace(
  /\\n/g,
  '\n',
);

const FIREBASE_CLIENT_ID = process?.env?.FIREBASE_CLIENT_ID;

export const SERVICE_ACCOUNT = {
  "type": "service_account",
  "project_id": "vidurdev-390ea",
  "private_key_id": "e4daf58d06cb8eca32e4c61ad6e494d7eab7317a",
  "private_key": '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDC7h8NfsHasoB+\nwLYvg5Tw1l6tMbub7czmgremrrJ1Ol11rBIX3VBfQPFsPrkI//BQEms+NYj4Uu6W\nOd6AXQyahNgkrW3jjN7iGwkHEmA4rw2t7zdMn3PCzjgm/qVCnuo9aKqUS3tTKg83\nhpPI1sWv950VAIMbAcNziFiueg+Ud3MA8yBbpaO3LZy6yUn82RnZURMyuFMRZfu7\nul8hw16wsbnB/x+Iwtf73bMp3VPuVTwj1if0Wmi3BaWhOnYKs9ntXZBwga5wl0No\nTFf2ogcTFiFM4kI6b+5YE3NemZZUOVzaMrBJg0glRkYEj44D/x6J6guEyIJ0vXGy\n04eADbtPAgMBAAECggEACRcydYj9dhCFs44924C8bRriNsYvT09LaKNHTfZZtjku\n60ectGY1fau5VpNPl8mFJdwmCjRURe3ALgYBiA+kKynvgTkL+zpc7ph/gZ1BcC33\nFQR8mg3ZnTJ20JgRkZt4UGgq2a2c0RJmEUXXwIcGQyA+FXZSUZZxzK0wIuWTB8O8\nJOSwawML0hskMeoxHa3rOkWN051gY5cvayInUv3XPSoVc4AFLVGt8qgAeXe+dZeS\n0eA8bXwLoXaBOXD/EeKmfrT12KEzoaYGLA+kAoV8Sk4aujGm74ne021SYAzACw96\nDDjzO/cLfUNtsVr9FwWv1CxO2Vya/O3+0SOzYJ2a0QKBgQDjJ24QLwPcGC1l9mzB\nURbbgAA4b/wAk7DCmAKQ8KeG8HRRBJHLROL5HnqakT0xiWtGLvYYoWk//jYxsd/l\nPkWQ36s9qkkc0mHhbeN6hiEfntof2Hm9UrA9GScIp0ZM9daH6Ql3irB5HIc7tC7M\nPPP7Qa28qcy6dHVJae189aqDqQKBgQDbrx990F9tdEIbtSsc03x6latrWFfA4+Ai\nv7Ad8pTpyXRVF1GFEa+hTPXVYYVPJmXdJ1mnmJdUirsRxa2rRtsyr/x9IrdqitU2\neK4oKw1xLICaUhAHf/U2dLaadNZAlvbwcM/sMgbQWTgT78Xf2LxU6HU8QqQVJ9F2\nSEv9gNciNwKBgEhGH2reyqeYubkbcvb/SfqE+4z5dIDqfO8tVoOvTl5M23V7sreu\nL1l8LR5I3+OHCa7G+l5T3R0TUUL2iXpzGcdCo0V3jNOyzJnhUOOHEbrx3A0N344x\nZQnLmvPR5ThPb/bGWtDCO+wM+6ovZkRtkGN9Pj4s+IrKyxaUsY90ytAhAoGAE+hr\nzyf57d5SO1aQoJ0ds7IqhaDM2wMLhbqfSCd6jTEfZLKnRYrTwqdJw9uBjCmro330\nZvayCAxGZZbnZRUXuiEunVxvCK2qIrSO+77jCfWBdfqnzzYuT5AGGDssS1Ai8qkW\nfo4OBgV/yna5FM78SimCrkJPwkcIeVKV6FQrqsMCgYBOzwSwK+XZw7b2HXBLuyaO\nX+DSCjTUstqceEfy/gFuXCBZlpx90xocpRa/Y/A7UL11dLpkHN1PQ8Hkou6MXjpk\nkG+3YDf+Gmspek/eOSGZdh5l/8qpCNd6bKhhR/C7g3nAYPTzas0U54bgK+H+lXXA\nNXjQ6ZWphxb+TgRpUU/Mqg==\n-----END PRIVATE KEY-----\n',
  "client_email": "firebase-adminsdk-1zrae@vidurdev-390ea.iam.gserviceaccount.com",
  "client_id": FIREBASE_CLIENT_ID,
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-1zrae%40vidurdev-390ea.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}


firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(
    SERVICE_ACCOUNT as ServiceAccount,
  ),
});


// Get a specific Firestore database by name
export const db = () => {
  return getFirestore(firebaseAdmin.app(), "authentication-server");
};

export const firebaseMessaging = firebaseAdmin.messaging();
