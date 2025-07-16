import firebaseAdmin, { type ServiceAccount } from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

const CERT = process?.env?.VIDUR_FIREBASE_SERVICE_ACC_PRIVATE_KEY?.replace(
  /\\n/g,
  '\n',
);

const FIREBASE_CLIENT_ID=process?.env?.FIREBASE_CLIENT_ID;

export const VIDUR_SERVICE_ACCOUNT = {
  "type": "service_account",
  "project_id": "vidurdev-390ea",
  "private_key_id": "e4daf58d06cb8eca32e4c61ad6e494d7eab7317a",
  "private_key": CERT,
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
    VIDUR_SERVICE_ACCOUNT as ServiceAccount,
  ),
});


// Get a specific Firestore database by name
export const db = () => {
  return getFirestore(firebaseAdmin.app(), "authentication-server");
};

export const firebaseMessaging = firebaseAdmin.messaging();
