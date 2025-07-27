import { DocumentData, DocumentSnapshot, PartialWithFieldValue, QueryDocumentSnapshot } from "firebase-admin/firestore";

export type Parser = {
  read: (doc: DocumentSnapshot<DocumentData, DocumentData> | QueryDocumentSnapshot<DocumentData, DocumentData>) => DocumentData | null;
  save: (doc: any) => PartialWithFieldValue<DocumentData>;
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

		return data;
	},

	save(doc) {
		return doc as PartialWithFieldValue<DocumentData>;
	},
};
