import { SessionData } from "express-session";
import { DocumentData, DocumentSnapshot, PartialWithFieldValue, QueryDocumentSnapshot } from "firebase-admin/firestore";

export type Parser = {
  read: (doc: DocumentSnapshot<DocumentData, DocumentData> | QueryDocumentSnapshot<DocumentData, DocumentData>) => SessionData | null;
  save: (data: SessionData) => PartialWithFieldValue<DocumentData>;
};

export const parser: Parser = {
	read(doc: DocumentSnapshot<DocumentData, DocumentData> | QueryDocumentSnapshot<DocumentData, DocumentData>) {
    if (!doc.exists) {
      return null;
    }

    const data = doc.data();
    if (!data) {
      return null;
    }

		return JSON.parse(data.value as string) as SessionData;
	},

	save(data: SessionData) {
    const doc = {
      value: JSON.stringify(data),
    } as PartialWithFieldValue<DocumentData>;
		return doc;
	},
};
