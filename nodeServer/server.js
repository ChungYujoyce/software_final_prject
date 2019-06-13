var userName = new Array()
var socket = new Array()
//import express 和 ws 套件
const express = require('express')
const SocketServer = require('ws').Server

//指定開啟的 port
const PORT = 8001

//創建 express 的物件，並綁定及監聽 3000 port ，且設定開啟後在 console 中提示
const server = express()
    .listen(PORT, () => console.log(`Listening on ${PORT}`))

//將 express 交給 SocketServer 開啟 WebSocket 的服務
const wss = new SocketServer({ server })



wss.on('connection', ws => {
    
    console.log('Client connected')
    
    ws.on('message', res => {
        if(res === "HeartBeat"){
            console.log("HeartBeat")
            ws.send("ZZZZ")
        }
        else{
            var data = JSON.parse(res)
            console.log(data)
            if(data.isUserName) {
                userName.push(data.userName)
                socket.push(ws)
                console.log("---------UserName--------")
                for(var i = 0; i < userName.length; i++){
                    console.log(i + ":" + userName[i])
                }
                console.log("-------------------------")
            }
            else if(data.isMessage) {
                console.log("ZZZZZZZZZZZZZZZZZZZZZZ")
                for(var i = 0; i < userName.length; i++){
                    if(userName[i] === data.to){
                        socket[i].send("Message Request")
                        break
                    }
                }
            }
            else if(data.isFriendRequest){
                console.log("123")
                for(var i = 0; i < userName.length; i++){
                    if(userName[i] === data.to){
                        socket[i].send("Friend Request")
                        break
                    }
                }
            }
            else if(data.isSubscribe){
                console.log("12345")
                for(var i = 0; i < userName.length; i++){
                    if(userName[i] === data.to){
                        socket[i].send("Subscribe")
                        break
                    }
                }
            }
            else if(data.isLike){
                console.log("12345678")
                for(var i = 0; i < userName.length; i++){
                    if(userName[i] === data.to){
                        socket[i].send("Like")
                        break
                    }
                }
            }
        }
    })
    
    ws.on('close', () => {
        for(var i = 0; i < socket.length; i++) {
            if(socket[i] === ws){
                userName.splice(i,1)
                socket.splice(i,1)
                break
            }
        }
        console.log('Close connected')
    })
})