// import Chat from '../../Model/Chat.js';
// import Room from '../../Model/Room.js';
// import User from '../../Model/User.js';

import { Server } from "app/";
import { add_router, add_router_group } from "hooks/routerhook";
import path from 'path';
import fs from 'fs'

const Socket = require('socket.io');
const { getModel } = require('core/Model');


add_router_group('chat', () => {
    add_router('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'views/index.html'));

    })

    add_router('js/:file', (req, res) => {
        let { file } = req.params;
        let dir = path.join(__dirname, `js/${file}`)
        if (fs.existsSync(dir)) {
            res.sendFile(dir);
        } else {
            res.json({ error: 'File not found' }).status(404);
        }
    })

    add_router('iframe', (req, res) => {
        res.json({ success: true })
    })
})


function init(server) {
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


                let { data: res, error } = await collection.insertOrUpdate(data)
                if (error == null) {
                    socket.in(socket.host).emit('child_added_' + database, data);
                    socket.emit('child_added_' + database, data);
                }
            })
        })

        socket.on('get_collection_data', async (data, callback) => {
            let collection = getModel(data.database);
            console.log(data.database)
            let { data: res } = await collection.findMany();

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


init(Server)