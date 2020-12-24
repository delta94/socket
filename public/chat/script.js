let socket = io(window.location.origin);
function reciveMessage({msg, time}){
    let data = `<div class="message info">
    <img class="img-circle medium-image" alt="" src="https://bootdey.com/img/Content/avatar/avatar1.png">
    <div class="message-body">
       <div class="message-info">
          <h4> Elon Musk </h4>
          <h5><i class="fa fa-clock-o"></i>  ${time}</h5>
       </div>
       <hr>
       <div class="message-text">${msg}</div>
    </div>
    <br>
 </div>`

 $('.message-body.active .message-chat .chat-body').append(data)
}

function sendMessage({msg, time}){
    let data = `<div class="message my-message">
    <img class="img-circle medium-image" alt="" src="https://bootdey.com/img/Content/avatar/avatar1.png">
    <div class="message-body">
       <div class="message-body-inner">
          <div class="message-info">
             <h4> Dennis Novac </h4>
             <h5><i class="fa fa-clock-o"></i> ${time}</h5>
          </div>
          <hr>
          <div class="message-text">${msg}</div>
       </div>
    </div>
    <br>
 </div>`
 $('.message-body.active .message-chat .chat-body').append(data)

}



$('.send-message-text').keyup(function(e){
    if(e.which === 13){
        let val = $(this).val().trim();
        if(val){
            socket.emit('chat message', val, (msg) => {
                console.log(msg)
                sendMessage(msg)
                $(this).val('')
            })
            
        }
    }
})


socket.on('client message', msg => {
    reciveMessage(msg);
})


