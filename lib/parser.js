"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parser = void 0;
exports.parser = {
    read(doc) {
        if (!doc.exists) {
            return null;
        }
        const data = doc.data();
        if (!data) {
            return null;
        }
        return JSON.parse(data.value);
    },
    save(data) {
        const doc = {
            value: JSON.stringify(data),
        };
        return doc;
    },
};
