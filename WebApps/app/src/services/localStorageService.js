import { stringBase64 } from "./constants"

export default {
    setItem: function (name, value) {
        localStorage.setItem(name, stringBase64(value))
    },
    setItems: function (object) {
        for (const key in object) { this.setItem(key, object[key]) }
    },
    getItem: function (name) { return stringBase64(localStorage.getItem(name), true) },
    getItems: function (names_array) {
        return names_array.reduce((prev, current) => {
            prev[current] = this.getItem(current);
            return prev;
        }, {})
    },
    deleteItem: function (name) { localStorage.removeItem(name) },
    deleteItems: function (names_array) {
        names_array.forEach((e) => { this.deleteItem(e) })
    },
    clear: function () { localStorage.clear() }
}