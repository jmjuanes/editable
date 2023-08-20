import * as idb from "idb-keyval";
import {uid} from "uid/secure";
// import {VERSION} from "./constants.js";

// Global store
const store = idb.createStore("kodi", "kodi-notebooks");

// Client object
const client = {
    config: {},
    session: null,
    getNotebooks: () => {
        return Promise.resolve({});
    },
    addNotebook: data => {
        const id = uid(16);
        return idb.set(id, data, store).then(() => {
            return id;
        });
    },
    getNotebook: id => {
        return idb.get(id, store);
    },
    updateNotebook: (id, newData) => {
        return idb.update(id, prevData => ({...prevData, ...newData}), store);
    },
    deleteNotebook: id => {
        return idb.del(id, store);
    },
};

export default client;
