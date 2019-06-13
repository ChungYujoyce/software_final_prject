var username = 'visitor'
var friend = ''
var dialogLength = 0
var lastMessageLength = 0
var lastMessage = []
var myInterval
$(document).ready(function() {
    //resize()
    username = $('.session').text()
    var uid = $('.uid').text()
    //console.log(username)
    if(username == 'visitor') {
        $('.notlogin').fadeIn()
    }
    else {
        getUserNavInfo()
        $('.islogin').fadeIn()
        getFriendList()
        getNotification()
        getNoteMessage()
    }
    getLastMessage(uid)
})
$('.input-message').keydown(function(e) {
    if(e.keyCode==13 && $(this).val()!='') {
        var data = new FormData()
        data.append('from', username)
        data.append('to', friend)
        data.append('type', 'text')
        data.append('content', $(this).val())
        //socket
        sendMessage(username, friend)
        $.ajax({
            type: 'post',
            url: 'apis/send_message',
            data: data,
            processData: false,
            contentType: false,
            success: function(response) {
                //console.log(response)
                $('.input-message').val('')
                $('.message-list').children().removeClass('m-selected')
                $('.message-list').children().first().addClass('m-selected')
            }
        })
    }
})
$('.send-message').click(function() {
    if($('.input-message').val()!='') {
        var data = new FormData()
        data.append('from', username)
        data.append('to', friend)
        data.append('type', 'text')
        data.append('content', $('.input-message').val())
        //socket
        sendMessage(username, friend)
        $.ajax({
            type: 'post',
            url: 'apis/send_message',
            data: data,
            processData: false,
            contentType: false,
            success: function(response) {
                //console.log(response)
                $('.input-message').val('')
                $('.message-list').children().removeClass('m-selected')
                $('.message-list').children().first().addClass('m-selected')
            }
        })
    }
})
function updateLastMessage() {
    var data = new FormData()
    data.append('username', username)
    $.ajax({
        type: 'post',
        url: 'apis/get_last_message',
        data: data,
        processData: false,
        contentType: false,
        dataType: 'json',
        success: async function(res) {
            //console.log(response)
            response = res['message']
            for(var i=0; i<lastMessageLength; i++) {
                var uid = response[i]['_from']==username?response[i]['_to']:response[i]['_from']
                var uname = ''
                var uurl = ''
                var data = new FormData()
                data.append('username', uid)
                data.append('col', 'name, url')
                await $.ajax({
                    type: 'post',
                    url: 'apis/get_user_info',
                    data: data,
                    processData: false,
                    contentType: false,
                    dataType: 'json',
                    success: function(response) {
                        //console.log(response)
                        uname = response[0]['name']
                        uurl = response[0]['url']
                    }
                })
                if(response[i]['_to']==username && response[i]['_read']=='no')
                    lastMessage[i].addClass('read')
                else {
                    lastMessage[i].removeClass('read')
                }
                //console.log(uid)
                lastMessage[i].children().eq(0).text(uid)
                lastMessage[i].children().eq(1).children().first().prop('src', uurl)
                lastMessage[i].children().eq(2).children().eq(0).text(uname)
                if(response[i]['content']=='') {
                    lastMessage[i].children().eq(2).children().eq(1).text('(a videohhhhh!!!)')
                }
                else
                    lastMessage[i].children().eq(2).children().eq(1).text(response[i]['content'])
                lastMessage[i].children().eq(3).text(getMyTime(response[i]['send_time']))
                lastMessage[i].children().eq(4).text(response[i]['id'])
            }
            for(var i=lastMessageLength; i<response.length; i++) {
                var message = $('<div>', {
                    class: 'amessage',
                    click: function() {
                        $(this).addClass('m-selected')
                        $(this).siblings().removeClass('m-selected')
                        var friendId = $(this).children().first().text()
                        friend = friendId
                        dialogLength = 0
                        $('.dialog').empty()
                        var mid = $(this).children().eq(4).text()
                        var data = new FormData()
                        data.append('username', username)
                        data.append('read', '')
                        data.append('id', mid)
                        $.ajax({
                            type: 'post',
                            url: 'apis/set_last_message',
                            data: data,
                            processData: false,
                            contentType: false,
                            success: function(response) {
                                console.log(response)
                            }
                        })
                    }
                })
                if(response[i]['_to']==username && response[i]['_read']=='no')
                    message.addClass('read')
                else {
                    message.removeClass('read')
                }
                var uid = response[i]['_from']==username?response[i]['_to']:response[i]['_from']
                var uname = ''
                var uurl = ''
                var data = new FormData()
                data.append('username', uid)
                data.append('col', 'name, url')
                await $.ajax({
                    type: 'post',
                    url: 'apis/get_user_info',
                    data: data,
                    processData: false,
                    contentType: false,
                    dataType: 'json',
                    success: function(response) {
                        //console.log(response)
                        uname = response[0]['name']
                        uurl = response[0]['url']
                    }
                })
                //console.log(uid)
                var mid = $('<div>', {class: 'mn-id', text: response[i]['id']})
                var id = $('<div>', {class: 'friend-id', text: uid})
                var icon = $('<div>', {class: 'msg-icon'})
                var img = $('<img>').prop('src', uurl)
                icon.append(img)
                var text = $('<div>', {class: 'm-text'})
                var name = $('<div>', {class: 'm-name', text: uname})
                if(response[i]['content']=='') {
                    var preview = $('<div>', {class: 'm-preview', text: '(a videohhhhh!!!)'})
                }
                else
                    var preview = $('<div>', {class: 'm-preview', text: response[i]['content']})
                text.append(name)
                text.append(preview)
                var time = $('<div>', {class: 'm-time', text: getMyTime(response[i]['send_time'])})
                message.append(id)
                message.append(icon)
                message.append(text)
                message.append(time)
                message.append(mid)
                lastMessage.push(message)
                $('.message-list').append(message)
            }
            lastMessageLength = response.length
        },
        error: function(jqXHR, textStatus, errorThrown) {
            //console.log(textStatus)
        }
    })
}
function getLastMessage(userid) {
    var data = new FormData()
    data.append('username', username)
    console.log(userid)
    $.ajax({
        type: 'post',
        url: 'apis/get_last_message',
        data: data,
        processData: false,
        contentType: false,
        dataType: 'json',
        success: async function(res) {
            response = res['message']
            //console.log(response)
            $('.message-list').empty()
            for(var i=0; i<response.length; i++) {
                var message = $('<div>', {
                    class: 'amessage',
                    click: function() {
                        $(this).addClass('m-selected')
                        $(this).siblings().removeClass('m-selected')
                        var friendId = $(this).children().first().text()
                        dialogLength = 0
                        friend = friendId
                        $('.dialog').empty()
                        getDialog()
                        var mid = $(this).children().eq(4).text()
                        var data = new FormData()
                        data.append('username', username)
                        data.append('read', '')
                        data.append('id', mid)
                        $.ajax({
                            type: 'post',
                            url: 'apis/set_last_message',
                            data: data,
                            processData: false,
                            contentType: false,
                            success: function(response) {
                                console.log(response)
                            }
                        })
                    }
                })
                if(response[i]['_to']==username && response[i]['_read']=='no')
                    message.addClass('read')
                else {
                    message.removeClass('read')
                }
                var uid = response[i]['_from']==username?response[i]['_to']:response[i]['_from']
                var uname = ''
                var uurl = ''
                var data = new FormData()
                data.append('username', uid)
                data.append('col', 'name, url')
                await $.ajax({
                    type: 'post',
                    url: 'apis/get_user_info',
                    data: data,
                    processData: false,
                    contentType: false,
                    dataType: 'json',
                    success: function(response) {
                        //console.log(response)
                        uname = response[0]['name']
                        uurl = response[0]['url']
                    }
                })
                //console.log(uid)
                if(userid == '' && i==0) {
                    var data = new FormData()
                    data.append('username', username)
                    data.append('read', '')
                    data.append('id', response[0]['id'])
                    $.ajax({
                        type: 'post',
                        url: 'apis/set_last_message',
                        data: data,
                        processData: false,
                        contentType: false,
                        success: function(response) {
                            console.log(response)
                        }
                    })
                    message.addClass('m-selected')
                    friend = uid
                    clearInterval(myInterval)
                    myInterval = setInterval(getDialog, 500)
                }
                else if(uid == userid) {
                    message.addClass('m-selected')
                    friend = uid
                    clearInterval(myInterval)
                    myInterval = setInterval(getDialog, 500)
                }
                var mid = $('<div>', {class: 'mn-id', text: response[i]['id']})
                var id = $('<div>', {class: 'friend-id', text: uid})
                var icon = $('<div>', {class: 'msg-icon'})
                var img = $('<img>').prop('src', uurl)
                icon.append(img)
                var text = $('<div>', {class: 'm-text'})
                var name = $('<div>', {class: 'm-name', text: uname})
                if(response[i]['content']=='') {
                    var preview = $('<div>', {class: 'm-preview', text: '(a videohhhhh!!!)'})
                }
                else
                    var preview = $('<div>', {class: 'm-preview', text: response[i]['content']})
                text.append(name)
                text.append(preview)
                var time = $('<div>', {class: 'm-time', text: getMyTime(response[i]['send_time'])})
                message.append(id)
                message.append(icon)
                message.append(text)
                message.append(time)
                message.append(mid)
                lastMessage.push(message)
                $('.message-list').append(message)
            }
            lastMessageLength = response.length
            var data = new FormData()
            data.append('username', username)
            data.append('view', '')
            $.ajax({
                type: 'post',
                url: 'apis/set_last_message',
                data: data,
                processData: false,
                contentType: false,
                success: function(response) {
                    //console.log(response)
                }
            })
            setInterval(function() {
                updateLastMessage()
                getDialog()
            }, 1000)
        },
        error: function(jqXHR, textStatus, errorThrown) {
            //console.log(textStatus)
        }
    })
}
async function getDialog() {
    var data = new FormData()
    data.append('username', friend)
    data.append('col', 'name, url')
    var friendURL = ''
    var title = ''
    await $.ajax({
        type: 'post',
        url: 'apis/get_user_info',
        data: data,
        processData: false,
        contentType: false,
        dataType: 'json',
        success: function(response) {
            //response = $.parseJSON(response)
            //console.log(response)
            friendURL = response[0]['url']
            title = response[0]['name']
        }
    })
    $('.room-title').text(title)
    var data = new FormData()
    data.append('username', username)
    data.append('friend', friend)
    await $.ajax({
        type: 'post',
        url: 'apis/get_dialog',
        data: data,
        processData: false,
        contentType: false,
        dataType: 'json',
        success: function(response) {
            //console.log(response)
            var fromuser = response['fromuser']
            var fromfriend = response['fromfriend']
            var dialog = merge(fromuser, fromfriend)
            //console.log(dialog)
            for(var i=dialogLength; i<dialog.length; i++) {
                var message = $('<div>', {class: 'd-message'})
                if(dialog[i]['_from']==username) {
                    var time = $('<div>', {class: 'd-time r', text: getMyTime2(dialog[i]['send_time'])})
                    if(dialog[i]['type']=='text') {
                        var text = $('<div>', {class: 'd-txt r', text: dialog[i]['content']})
                        message.append(text)
                        message.append(time)
                    }
                    else if(dialog[i]['type']=='video') {
                        var video = $('<div>', {class: 'd-video r'})
                        var begin = $('<div>', {class: 'begin', text: dialog[i]['begin']})
                        var end = $('<div>', {class: 'end', text: dialog[i]['end']})
                        var v = $('<video>').prop('src', 'videos/'+dialog[i]['video_id']+'.mp4')
                        var playBtn = $('<div>', {
                            class: 'play-btn',
                            click: function() {
                                $(this).siblings()[2].play()
                                $(this).fadeOut()
                            }
                        })
                        var playi = $('<i>', {class: 'far fa-play-circle'})
                        playBtn.append(playi)
                        var value = $('<div>', {class: 'd-value'})
                        //console.log(dialog[i]['begin'])
                        v[0].currentTime = dialog[i]['begin']
                        v[0].ontimeupdate = function() {
                            var end = parseFloat($(this).siblings().eq(1).text())
                            var begin = parseFloat($(this).siblings().eq(0).text())
                            var percent = (this.currentTime - begin)/(end - begin)
                            $(this).siblings().eq(3).css('width', 100*percent+'%')
                            if(this.currentTime >= end) {
                                this.pause()
                                this.currentTime = begin
                                //console.log($(this).siblings().eq(2).css('display', 'block'))
                            }
                        }
                        video.append(begin)
                        video.append(end)
                        video.append(v)
                        video.append(playBtn)
                        video.append(value)
                        message.append(video)
                        message.append(time)
                    }
                    $('.dialog').append(message)
                }
                else {
                    var icon = $('<div>', {class: 'd-icon'})
                    var img = $('<img>').prop('src', friendURL)
                    icon.append(img)
                    var time = $('<div>', {class: 'd-time', text: getMyTime2(dialog[i]['send_time'])})
                    if(dialog[i]['type']=='text') {
                        var text = $('<div>', {class: 'd-txt', text: dialog[i]['content']})
                        message.append(icon)
                        message.append(text)
                        message.append(time)
                    }
                    else if(dialog[i]['type']=='video') {
                        var video = $('<div>', {class: 'd-video'})
                        var begin = $('<div>', {class: 'begin', text: dialog[i]['begin']})
                        var end = $('<div>', {class: 'end', text: dialog[i]['end']})
                        var v = $('<video>').prop('src', 'videos/'+dialog[i]['video_id']+'.mp4')
                        var playBtn = $('<div>', {
                            class: 'play-btn',
                            click: function() {
                                $(this).siblings()[2].play()
                                $(this).fadeOut()
                            }
                        })
                        var playi = $('<i>', {class: 'far fa-play-circle'})
                        playBtn.append(playi)
                        var value = $('<div>', {class: 'd-value'})
                        //console.log(dialog[i]['begin'])
                        v[0].currentTime = dialog[i]['begin']
                        v[0].ontimeupdate = function() {
                            var end = parseFloat($(this).siblings().eq(1).text())
                            var begin = parseFloat($(this).siblings().eq(0).text())
                            var percent = (this.currentTime - begin)/(end - begin)
                            $(this).siblings().eq(3).css('width', 100*percent+'%')
                            if(this.currentTime >= end) {
                                this.pause()
                                this.currentTime = begin
                                //console.log($(this).siblings().eq(2).css('display', 'block'))
                            }
                        }
                        video.append(begin)
                        video.append(end)
                        video.append(v)
                        video.append(playBtn)
                        video.append(value)
                        message.append(icon)
                        message.append(video)
                        message.append(time)
                    }
                    $('.dialog').append(message)
                }
            }
            if(dialogLength!=dialog.length) {
                dialogLength = dialog.length
                $('.dialog').scrollTop($('.dialog')[0].scrollHeight)
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            //console.log(textStatus)
        }
    })
}
function goLightMode() {

}
function goDarkMode() {
    
}
function merge(arr1, arr2) {
    let merged = []
    let i1=0
    let i2=0
    let cur=0
    while(cur < (arr1.length+arr2.length)) {
        let isArr1Depleted = i1 >=arr1.length
        let isArr2Depleted = i2 >=arr2.length
        if(!isArr1Depleted) { //1沒超過
            var t1 = new Date(arr1[i1]['send_time']).getTime()
            if(!isArr2Depleted) { //2沒超過
                var t2 = new Date(arr2[i2]['send_time']).getTime()
                //-------
                if(t1<t2) {    
                    merged[cur] = arr1[i1]
                    i1++
                }
                else {
                    merged[cur] = arr2[i2]
                    i2++
                }
            }
            else {
                merged[cur] = arr1[i1]
                i1++
            }
        }
        else {
            merged[cur] = arr2[i2]
            i2++
        }
        cur++
    }
    return merged
}