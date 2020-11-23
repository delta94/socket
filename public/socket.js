// let socket = io();

// socket.emit('new user', 'vuong', function(falg){
//     console.log('new user', falg)
// })

// function clickTosendMessage(chatboxtitle,toid,img) {

//     message = $(".chatboxtextarea").val();

//     message = message.replace(/^\s+|\s+$/g,"");

//     $(".chatboxtextarea").val('');
//     $(".chatboxtextarea").focus();
//     $(".input-placeholder").css({'visibility':'visible'});
//     $(".chatboxtextarea").css('height','20px');
//     if (message != '') {

//         message = message.replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;");
//         message = message.replace(/\n/g, "<br />");
//         var $con = message;
//         var $words = $con.split(' ');
//         for (i in $words) {
//             if ($words[i].indexOf('http://') == 0 || $words[i].indexOf('https://') == 0) {
//                 $words[i] = '<a href="' + $words[i] + '">' + $words[i] + '</a>';
//             }
//             else if ($words[i].indexOf('www') == 0 ) {
//                 $words[i] = '<a href="' + $words[i] + '">' + $words[i] + '</a>';
//             }
//         }
//         message = $words.join(' ');
//         message = emojione.shortnameToImage(message);  // Set imotions

//         $("#chatbox_"+chatboxtitle).append('<div class="col-xs-12 p-b-10 odd">' +
//         '<div class="chat-image  profile-picture max-profile-picture">' +
//         '<img alt="'+username+'" src="storage/user_image/'+Ses_img+'">' +
//         '</div>' +
//         '<div class="chat-body">' +
//         '<div class="chat-text">' +
//         '<h4>'+username+'</h4>' +
//         '<p>'+message+'</p>' +
//         '<b>Just Now</b><span class="msg-status msg-'+chatboxtitle+'"><i class="fa fa-check"></i></span>' +
//         '</div>' +
//         '</div>' +
//         '</div>');

//         $(".target-emoji").css({'display':'none'});
//         $('.wchat-filler').css({'height':0+'px'});
//         console.log(message, toid)
//         socket.emit('send message', message, toid);
//         scrollDown();
//     }



//     var adjustedHeight = $(".chatboxtextarea").clientHeight;
//     var maxHeight = 40;

//     if (maxHeight > adjustedHeight) {
//         adjustedHeight = Math.max($(".chatboxtextarea").scrollHeight, adjustedHeight);
//         if (maxHeight)
//             adjustedHeight = Math.min(maxHeight, adjustedHeight);
//         if (adjustedHeight > $(".chatboxtextarea").clientHeight)
//             $($(".chatboxtextarea")).css('height',adjustedHeight+8 +'px');
//     } else {
//         $($(".chatboxtextarea")).css('overflow','auto');
//     }
//     return false;
// }
// let socket = io(window.location.origin, {forceNew: true});
let socket = io(window.location.origin);

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

// (() => {
//     let node =document.createElement('script');
//     node.src = '/socket.io/socket.io.js';

//     node.addEventListener('load', initSocket)
//     document.body.appendChild(node);

// })()

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

            // let resT = {};
            // let { _id } = response;
            // if (_id) {
            //     resT.name = () => _id;
            //     delete response._id;
            // }
            // resT.val = () => response;

            callback(response)

        })

        switch (type) {
            case 'child_added':
                socket.emit('get_collection_data', {database: this._databaseName}, (data) => {
                    if(Array.isArray(data)){
                        data.forEach((e,i) => callback(e,i))
                    }
                })
                break;

            default: break;
        }
    }
}