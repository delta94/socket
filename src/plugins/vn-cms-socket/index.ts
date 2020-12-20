// import Chat from '../../Model/Chat.js';
// import Room from '../../Model/Room.js';
// import User from '../../Model/User.js';


const Socket = require('socket.io');
const { HookApp } = require('core/Hook');
const { getModel } = require('../../core/Model');
const path = require('path')






// setTimeout(async () => {
//     let [data, error] = await Chat.find()
//     console.log(data);
// }, 5000)


function init(express, server) {

    express.get('/chat', (req, res) => {
        res.sendFile(path.join(__dirname, './views/index.html'));
    })


    var io = Socket(server);

    let users = {},
        hosts = {};


    // function getCollection(name, host) {
    //     if (!(name in hosts[host].collections)) {
    //         hosts[host].collections[name] = ModelFlexible(name);
    //     }
    //     return hosts[host].collections[name];
    // }


    io.sockets.on('connection', function (socket) {

        socket.on('init', function (data) {
            console.log('user init');
            if (!(data.host in hosts)) {
                hosts[data.host] = {
                    collections: {},
                    users: {},
                }
            }

            if (!(data.uniqueId in users)) {
                users[data.uniqueId] = socket;
                socket.uniqueId = data.uniqueId;
            }
            socket.host = data.host;
            socket.join(data.host);

        })

        socket.on('push', function (data, callback) {

            let database = data.database;
            delete data.database;

            // data._id = Date.now();
            callback && callback(data);



            setTimeout(async () => {

                let collection = getModel(database);


                let [res, error] = await collection.insertOrUpdate(data)
                if (error == null) {
                    socket.in(socket.host).emit('child_added_' + database, data);
                    socket.emit('child_added_' + database, data);
                }
            })
        })

        socket.on('get_collection_data', async (data, callback) => {
            let collection = getModel(data.database);
            let [res] = await collection.find();

            callback(res);
        })

        console.log('a user connected');

        // socket.on('new user', function (name, data) {
        //     if (name in users) {
        //         data(false);
        //     } else {
        //         data(true);
        //         socket.nickname = name;
        //         users[socket.nickname] = socket;
        //         console.log('add nickName');
        //         updateNickNames();
        //     }

        // });

        // function updateNickNames() {
        //     io.sockets.emit('usernames', Object.keys(users));
        // }
        // socket.on('open-chatbox', function (data) {
        //     users[data].emit('openbox', { nick: socket.nickname });
        // });
        // socket.on('send message', function (data, sendto) {
        //     console.log(data, sendto)

        //     if(users[sendto]){
        //         users[sendto].emit('new message', { msg: data, nick: socket.nickname, sendto: sendto });
        //     }
        //     users[socket.nickname].emit('new message', { msg: data, nick: socket.nickname, sendto: sendto });

        //     console.log(data);
        // });


        socket.on('disconnect', function (data) {

            if (!socket.uniqueId) return;
            delete users[socket.uniqueId];
            // updateNickNames();
        });
    });

}

HookApp(init)