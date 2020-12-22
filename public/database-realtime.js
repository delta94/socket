let socket = io(window.location.origin);


// Manage all table realtime
class SocketDB {
    constructor(name) {
        if (name) {
            let uniqueId = Date.now();
            socket.emit('init', { host: name, uniqueId }, function (flag) {
                console.log('init', flag)
            })
        }

        this._database = {};

    }

    database(name) {
        if (!(name in this._database)) {
            this._database[name] = new SocketDBClient(name);
        }

        return this._database[name];
    }
}



// table realtime only
class SocketDBClient {
    constructor(name) {
        this._databaseName = name
    }

    push(data) {
        data.database = this._databaseName
        return new Promise((resolve, reject) => {
            socket.emit('push', data, function (response) {

                resolve([response])
            })
        })
    }

    on(type, callback) {

        socket.on(type + '_' + this._databaseName, function (response) {

            callback(response)

        })

        // Init data when reload page

        switch (type) {
            case 'child_added':
                socket.emit('get_collection_data', { database: this._databaseName }, (data) => {
                    if (Array.isArray(data)) {
                        data.forEach((e, i) => callback(e, i))
                    }
                })
                break;

            default: break;
        }
    }
}