var lockReconnect = false; //prevent repeat reconnect
var ws;
var interval
connect() 
function connect(){
    try {
        ws = new WebSocket("wss://videoh.2y.cc:8002")
        handleEvent()
    } 
    catch (e) {
        reconnect()
    }
}
function handleEvent() {
    ws.onopen = function() {
        heartCheck.reset().start()
        console.log('open connection')
        if(username == 'visitor'){
    
        }
        else{
            console.log(username)
            var user = {userName: username, isMessage: false, isUserName: true, isFriendRequest: false, isSubscribe: false, isLike: false}
            var data = JSON.stringify(user)
            ws.send(data)
        }
    }
    ws.onclose = function() {
        console.log('close connection')
        reconnect()
    }
    ws.onmessage = function(event) {
        heartCheck.reset().start()
        console.log(event.data)
        if(event.data === "Message Request") {
            updateNoteMessage()
        }
        else if(event.data === "Friend Request") {
            getSocketState("friend")
        }
        else if(event.data === "Subscribe") {
            getSocketState("subscribe")
        }
        else if(event.data === "Like") {
            getSocketState("")
        }
    }
    ws.onerror = function(e) {
        console.log("WebSocket發生錯誤:" + e.code)
        console.log(e)
        reconnect()
    }
}



function sendMessage(user, friend) {
    var tmp = {userName: user, isMessage: true, isUserName: false, isFriendRequest: false, isSubscribe: false, isLike: false, to: friend}
    var data = JSON.stringify(tmp)
    ws.send(data)
}
function sendFriend(user, friend) {
    console.log("send friend")
    getSocketState("friend")
    var tmp = {userName: user, isMessage: false, isUserName: false, isFriendRequest: true, isSubscribe: false, isLike: false, to: friend}
    var data = JSON.stringify(tmp)
    ws.send(data)
}
function sendSubscribeNotification(user, subscribed) {
    console.log("send subscribe")
    getSocketState("subscribe")
    var tmp = {userName: user, isMessage: false, isUserName: false, isFriendRequest: false, isSubscribe: true, isLike: false, to: subscribed}
    var data = JSON.stringify(tmp)
    ws.send(data)
}
function sendLikeNotification(user, liked) {
    console.log("like")
    console.log(user)
    console.log(liked)
    getSocketState("")
    var tmp = {userName: user, isMessage: false, isUserName: false, isFriendRequest: false, isSubscribe: false, isLike: true, to: liked}
    var data = JSON.stringify(tmp)
    ws.send(data)
}
function reconnect() {
    if(lockReconnect) return
    lockReconnect = true
    setTimeout(function () {     
        connect()
        lockReconnect = false
    }, 2000);
}

var heartCheck = {
    timeout: 10000,
    timeoutObj: null,
    serverTimeoutObj: null,
    reset: function(){
        clearTimeout(this.timeoutObj);
        clearTimeout(this.serverTimeoutObj);
        return this;
    },
    start: function(){
        var self = this;
        this.timeoutObj = setTimeout(function(){
   
            ws.send("HeartBeat");
            self.serverTimeoutObj = setTimeout(function(){
                ws.close();
            }, self.timeout)
        }, this.timeout)
    }
}
