import {Store} from 'express-session';
import {getFirestore,Firestore,CollectionReference,DocumentData} from 'firebase-admin/firestore';

export type FirestoreOptions = {
  collection?: string;
  database?: Firestore;
}

export default class FirestoreStore extends Store {
  collection: CollectionReference<DocumentData, DocumentData>;

  constructor(options: FirestoreOptions) {
    super();

    const database = options.database || getFirestore();
    const collection = options.collection || "sessions";

    this.collection = database.collection(collection);
  }

  all(callback: (err: Error | null, sessions?: Record<string, any>) => void): void {
    this.collection.get().then(snapshot => {
      const sessions = snapshot.docs.map(doc => {
        return doc.data();
      });
      callback(null, sessions);
    }).catch(err => {
      callback(err);
    });
  }

  destroy(sid: string, callback: (err?: any) => void): void {
    this.collection.doc(sid).delete().then(() => {
      callback();
    }).catch(err => {
      callback(err);
    });
  }

  clear(callback: (err?: any) => void): void {
    this.collection.get().then(snapshot => {
      const batch = this.collection.firestore.batch();
      snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      return batch.commit();
    }).then(() => {
      callback();
    }).catch(err => {
      callback(err);
    });
  }

  get(sid: string, callback: (err: Error | null, session?: any) => void): void {
    this.collection.doc(sid).get().then(doc => {
      if (!doc.exists) {
        return callback(null, null);
      }
      const data = doc.data();
      callback(null, data);
    }).catch(err => {
      callback(err);
    });
  }

  set(sid: string, session: any, callback: (err?: any) => void): void {
    this.collection.doc(sid).set(session).then(() => {
      callback();
    }).catch(err => {
      callback(err);
    });
  }

  touch(sid: string, session: any, callback: (err?: any) => void): void {
    this.set(sid, session, callback);
  }
}
