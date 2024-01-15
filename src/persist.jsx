const Persist = {
    
    objects: {},

    setItem(key, data) {
        this.objects[key] = data;
    },

    getItem(key) {
        return this.objects[key];
    }
}

export default Persist;