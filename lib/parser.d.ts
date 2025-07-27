import { SessionData } from "express-session";
import { DocumentData, DocumentSnapshot, PartialWithFieldValue, QueryDocumentSnapshot } from "firebase-admin/firestore";
export type Parser = {
    read: (doc: DocumentSnapshot<DocumentData, DocumentData> | QueryDocumentSnapshot<DocumentData, DocumentData>) => SessionData | null;
    save: (data: SessionData) => PartialWithFieldValue<DocumentData>;
};
export declare const parser: Parser;
