import {Store} from 'express-session';
import {getFirestore,Firestore,CollectionReference,DocumentData} from 'firebase-admin/firestore';
import {Parser, parser} from './parser';

export type FirestoreOptions = {
  collection?: string;
  database?: Firestore;
  parser?: Parser;
}

export default class FirestoreStore extends Store {
  collection: CollectionReference<DocumentData, DocumentData>;
  parser: Parser;

  constructor(options: FirestoreOptions) {
    super();

    this.parser = options.parser || parser;
    const database = options.database || getFirestore();
    const collection = options.collection || "sessions";

    this.collection = database.collection(collection);
  }

  all(callback: (err: Error | null, sessions?: Record<string, any>) => void): void {
    this.collection.get().then(snapshot => {
      const sessions = snapshot.docs.map(doc => this.parser.read(doc));
      callback(null, sessions);
    }).catch(err => {
      callback(err);
    });
  }

  get(sid: string, callback: (err: Error | null, session?: any) => void): void {
    this.collection.doc(sid).get().then(doc => {
      const data = this.parser.read(doc);
      callback(null, data);
    }).catch(err => {
      callback(err);
    });
  }

  set(sid: string, session: any, callback: (err?: any) => void): void {
    const data = this.parser.save(session);
    this.collection.doc(sid).set(data).then(() => {
      callback();
    }).catch(err => {
      callback(err);
    });
  }

  touch(sid: string, session: any, callback: (err?: any) => void): void {
    this.set(sid, session, callback);
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
}
