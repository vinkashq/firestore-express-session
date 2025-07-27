"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_session_1 = require("express-session");
const firestore_1 = require("firebase-admin/firestore");
const parser_1 = require("./parser");
class FirestoreStore extends express_session_1.Store {
    constructor(options) {
        super();
        this.parser = options.parser || parser_1.parser;
        const database = options.database || (0, firestore_1.getFirestore)();
        const collection = options.collection || "sessions";
        this.collection = database.collection(collection);
    }
    all(callback) {
        this.collection.get().then(snapshot => {
            const sessions = snapshot.docs.map(doc => this.parser.read(doc));
            callback(null, sessions);
        }).catch(err => {
            callback(err);
        });
    }
    get(sid, callback) {
        this.collection.doc(sid).get().then(doc => {
            const data = this.parser.read(doc);
            callback(null, data);
        }).catch(err => {
            callback(err);
        });
    }
    set(sid, session, callback) {
        const data = this.parser.save(session);
        this.collection.doc(sid).set(data).then(() => {
            callback();
        }).catch(err => {
            callback(err);
        });
    }
    touch(sid, session, callback) {
        this.set(sid, session, callback);
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
}
exports.default = FirestoreStore;
