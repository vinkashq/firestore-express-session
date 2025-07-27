import { Store } from 'express-session';
import { Firestore, CollectionReference, DocumentData } from 'firebase-admin/firestore';
import { Parser } from './parser';
export type FirestoreOptions = {
    collection?: string;
    database?: Firestore;
    parser?: Parser;
};
export default class FirestoreStore extends Store {
    collection: CollectionReference<DocumentData, DocumentData>;
    parser: Parser;
    constructor(options: FirestoreOptions);
    all(callback: (err: Error | null, sessions?: Record<string, any>) => void): void;
    get(sid: string, callback: (err: Error | null, session?: any) => void): void;
    set(sid: string, session: any, callback: (err?: any) => void): void;
    touch(sid: string, session: any, callback: (err?: any) => void): void;
    destroy(sid: string, callback: (err?: any) => void): void;
    clear(callback: (err?: any) => void): void;
}
