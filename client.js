import * as idb from "idb-keyval";
import {uid} from "uid/secure";
// import {VERSION} from "./constants.js";

// Global store
const notebooksStore = idb.createStore("kodi", "kodi-notebooks");

// Client object
const client = {
    config: {},
    session: null,
    listNotebooks: async () => {
        const notebooks = [];
        await notebooksStore("readonly", store => {
            store.openCursor().addEventListener("success", event => {
                const cursor = event.target.result;
                if (cursor) {
                    notebooks.push({
                        id: cursor.key,
                        title: cursor.value?.title || "untitled",
                        description: cursor.value?.description || "Description of this notebook.",
                        private: true,
                        updatedAt: cursor.value?.updatedAt,
                    });
                    return cursor.continue();
                }
            });
            return idb.promisifyRequest(store.transaction);
        });
        return notebooks.sort((a, b) => {
            return b.updatedAt - a.updatedAt;
        });
    },
    addNotebook: data => {
        const id = uid(16);
        return idb.set(id, data, notebooksStore).then(() => {
            return id;
        });
    },
    getNotebook: id => {
        return idb.get(id, notebooksStore);
    },
    updateNotebook: (id, newData) => {
        return idb.update(id, prevData => ({...prevData, ...newData}), notebooksStore);
    },
    deleteNotebook: id => {
        return idb.del(id, notebooksStore);
    },
};

export default client;
