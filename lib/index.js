import { Store } from 'express-session';
import { getFirestore } from 'firebase-admin/firestore';
export default class FirestoreStore extends Store {
    constructor(options) {
        super();
        const database = options.database || getFirestore();
        const collection = options.collection || "sessions";
        this.collection = database.collection(collection);
    }
    all(callback) {
        this.collection.get().then(snapshot => {
            const sessions = snapshot.docs.map(doc => {
                return doc.data();
            });
            callback(null, sessions);
        }).catch(err => {
            callback(err);
        });
    }
    destroy(sid, callback) {
        this.collection.doc(sid).delete().then(() => {
            callback();
        }).catch(err => {
            callback(err);
        });
    }
    clear(callback) {
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
    get(sid, callback) {
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
    set(sid, session, callback) {
        this.collection.doc(sid).set(session).then(() => {
            callback();
        }).catch(err => {
            callback(err);
        });
    }
    touch(sid, session, callback) {
        this.set(sid, session, callback);
    }
}
