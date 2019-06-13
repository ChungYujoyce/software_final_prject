var drawer = true
var searchid = -1
var total = 0
var key = ''
var darkMode = false
var notificationLength = 0
var notification = []
var noteMessageLength = 0
var noteMessage = []
var pageTitle = ''
$(document).ready(function() {
    //console.log($('.dark-mode').text())
    if ($('.dark-mode').text() == 'yes') {
        darkMode = true
        goDarkMode()
    }
    else {
        darkMode = false
        goLightMode()
    }
})
$('.menu-btn').click(toggleDrawer)
$('.brand').click(function () {
    window.location.href = '/'
})
$('.notification').click(function () { // show notification (button click on right corner) detection
    if ($('.n-notification').css('display') == 'block') {
        $('.n-notification').css('display', 'none')
        $(this).children().eq(1).removeClass('fas')
        $(this).children().eq(1).addClass('far')
    }
    else if ($('.n-notification').css('display') == 'none') {
        $('.n-notification').css('display', 'block')
        $(this).children().eq(1).removeClass('far')
        $(this).children().eq(1).addClass('fas')
        var data = new FormData()
        data.append('username', username)
        data.append('view', '')
        $.ajax({
            type: 'post',
            url: 'apis/set_notification',
            data: data,
            processData: false,
            contentType: false,
            success: function(response) {
                //console.log(response)
                updateNotification()
            }
        })
    }
    $('.m-notification').css('display', 'none')
    $('.message').children().eq(1).removeClass('fas')
    $('.message').children().eq(1).addClass('far')
})
$('.message').click(function () { // show messages (button click on right corner) detection
    if ($('.m-notification').css('display') == 'block') {
        $('.m-notification').css('display', 'none')
        $(this).children().eq(1).removeClass('fas')
        $(this).children().eq(1).addClass('far')
    }
    else if ($('.m-notification').css('display') == 'none') {
        $('.m-notification').css('display', 'block')
        $(this).children().eq(1).removeClass('far')
        $(this).children().eq(1).addClass('fas')
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
                updateNoteMessage()
            }
        })
    }
    $('.n-notification').css('display', 'none')
    $('.notification').children().eq(1).removeClass('fas')
    $('.notification').children().eq(1).addClass('far')
})
$('.theme').click(function () { // change color-theme detection
    toggleDarkMode()
})
$('.search-btn').click(function () { // search certain video detection
    if ($('.search-txt').val() != '') {
        window.location.href = 'result?search_query=' + $('.search-txt').val()
    }
})
$('.search-txt').keyup(function (e) { // search text-input
    //e.preventDefault()
    if (e.keyCode == 27) { //esc
        $(this).val('')
        searchid = -1
        $(this).blur()
        $('.search-advice').css('display', 'none')
    }
    else if (e.keyCode == 37) {

    }
    else if (e.keyCode == 38) { // up arrow shifting videos
        e.preventDefault()
        if (searchid != -1) {
            searchid--
            var tmp = $('.search-advice').children().eq(searchid).children().eq(1).text()
            //console.log(tmp)
            $('.search-txt').val('')
            $('.search-txt').val(tmp)
        }
        else if (searchid == -1) {
            searchid = total - 1
            var tmp = $('.search-advice').children().eq(searchid).children().eq(1).text()
            //console.log(tmp)
            $('.search-txt').val('')
            $('.search-txt').val(tmp)
        }
        if (searchid == -1) {
            $('.search-txt').val('')
            $('.search-txt').val(key)
        }
    }
    else if (e.keyCode == 39) {

    }
    else if (e.keyCode == 40) { // down arrow shifting videos
        e.preventDefault()
        if (searchid != total - 1) {
            searchid++
            var tmp = $('.search-advice').children().eq(searchid).children().eq(1).text()
            //console.log(tmp)
            $('.search-txt').val('')
            $('.search-txt').val(tmp)
        }
        else if (searchid == total - 1) {
            searchid = -1
            $('.search-txt').val('')
            $('.search-txt').val(key)
        }
    }
    else { // enter
        key = $('.search-txt').val()
        //console.log(key)
        if (key == '') {
            searchid = -1
            $('.search-advice').css('display', 'none')
        }
        else {
            var data = new FormData()
            data.append('key', key)
            data.append('begin', true)
            data.append('username', username)
            $.ajax({
                type: 'post',
                url: 'apis/search_db',
                data: data,
                processData: false,
                contentType: false,
                dataType: 'json',
                success: function (response) { // find the video
                    var searchList = response['videos']
                    $('.search-advice').empty()
                    total = searchList.length
                    for (var i = 0; i < searchList.length; i++) { // show all relative videos (by searching video name)
                        var advice = $('<div>', {
                            class: 'advice',
                            click: function () {
                                var id = $(this).children().first().text()
                                window.location.href = 'watch?v=' + id
                            }
                        })
                        var id = $('<div>', { class: 'advice-id', text: searchList[i]['video_id'] })
                        var name = $('<div>', { class: 'advice-name', text: searchList[i]['name'] })
                        advice.append(id)
                        advice.append(name)
                        $('.search-advice').append(advice)
                    }
                    searchList = response['users']
                    total += searchList.length
                    for (var i = 0; i < searchList.length; i++) { // show all relative user (by searching user name)
                        var advice = $('<div>', {
                            class: 'advice',
                            click: function () {
                                var id = $(this).children().first().text()
                                window.location.href = 'profile?u=' + id
                            }
                        })
                        var id = $('<div>', { class: 'advice-id', text: searchList[i]['username'] })
                        var name = $('<div>', { class: 'advice-name', text: searchList[i]['name'] })
                        advice.append(id)
                        advice.append(name)
                        $('.search-advice').append(advice)
                    }
                    if (total == 0) {
                        $('.search-advice').css('display', 'none')
                    }
                    else {
                        $('.search-advice').css('display', 'block')
                    }
                }
            })
        }
    }
    $('.search-advice').children().removeClass('search-selected')
    if (searchid != -1) {
        $('.search-advice').children().eq(searchid).addClass('search-selected') // go to the video
    }
})
function getSocketState(type) {
    updateNotification()
    if(type=='friend') {
        console.log(type)
        getFriendState(username, uid)
    }
    else if(type=='subscribe')
        getSubscribeState()
}
function getNotification() { // notification display
    var data = new FormData()
    data.append('username', username)
    $.ajax({
        type: 'post',
        url: 'apis/get_notification',
        data: data,
        processData: false,
        contentType: false,
        dataType: 'json',
        success: async function (response) { // different action other users have done to you
            //console.log(response)
            var normal = response['normal']
            var unviewlength = response['norlength']
            pageTitle = document.title
            if(unviewlength!=0) {
                document.title = '('+unviewlength+') '+ pageTitle
                $('.unview').text(unviewlength)
                $('.unview').css('display', 'block')
            }
            else {
                document.title = pageTitle
                $('.unview').css('display', 'none')
            }
            //console.log(unviewlength)
            $('.nn-list').empty()
            for (var i = 0; i < normal.length; i++) { // show all notifications
                var nn = $('<div>', {
                    class: 'nn',
                    click: function () {
                        var id = $(this).children().eq(0).text()
                        var type = $(this).children().eq(1).text()
                        var nid = $(this).children().eq(4).text()
                        var data = new FormData()
                        data.append('username', username)
                        data.append('read', '')
                        data.append('id', nid)
                        $.ajax({
                            type: 'post',
                            url: 'apis/set_notification',
                            data: data,
                            processData: false,
                            contentType: false,
                            success: function(response) {
                                console.log(response)
                                updateNotification()
                                if(type=='friend') {
                                    window.location.href = 'profile?u='+id
                                }
                            }
                        })
                    }
                })
                if(normal[i]['_read']=='yes')
                    nn.removeClass('read')
                else if(normal[i]['_read']=='no')
                    nn.addClass('read')
                var data = new FormData()
                data.append('username', normal[i]['_from'])
                data.append('col', 'name, url')
                var fromURL = ''
                var fromName = ''
                await $.ajax({
                    type: 'post',
                    url: 'apis/get_user_info',
                    data: data,
                    processData: false,
                    contentType: false,
                    dataType: 'json',
                    success: function (response) { // the user info
                        //response = $.parseJSON(response)
                        //console.log(response)
                        if(response[0] != undefined) {
                            fromURL = response[0]['url']
                            fromName = response[0]['name']
                        }
                    },
                    error: function() {
            
                    }
                })
                var nid = $('<div>', {class: 'nn-id', text: normal[i]['id']}) 
                var id = $('<div>', {class: 'nn-id', text: normal[i]['_from']})
                var icon = $('<div>', {class: 'nn-icon'})
                var img = $('<img>').prop('src', fromURL)
                icon.append(img)
                var txt = $('<div>', { class: 'nn-txt' })
                if (normal[i]['content'] == 'friend request') { // different actions
                    var c = fromName + '寄了交友邀請給你'
                    var type = $('<div>', { class: 'nn-type', text: 'friend' })
                }
                else if (normal[i]['content'] == 'friend accept') {
                    var c = fromName + '接受了你的交友邀請'
                    var type = $('<div>', { class: 'nn-type', text: 'friend' })
                }
                else if (normal[i]['content'] == 'subscribe') {
                    var c = fromName + '訂閱了你的頻道'
                    var type = $('<div>', { class: 'nn-type', text: 'subscribe' })
                }
                else if (normal[i]['content'] == 'unsubscribe') {
                    var c = fromName + '取消訂閱了你的頻道'
                    var type = $('<div>', { class: 'nn-type', text: 'subscribe' })
                }
                else if (normal[i]['content'] == 'like') {
                    var c = fromName + '說你的影片讚'
                    var type = $('<div>', { class: 'nn-type', text: 'like' })
                }
                else if (normal[i]['content'] == 'unlike') {
                    var c = fromName + '收回了對你影片的讚'
                    var type = $('<div>', { class: 'nn-type', text: 'like' })
                }
                var content = $('<div>', { class: 'nn-content', text: c })
                var time = $('<div>', { class: 'nn-time', text: getMyTime(normal[i]['time']) })
                txt.append(content)
                txt.append(time)
                nn.append(id)
                nn.append(type)
                nn.append(icon)
                nn.append(txt)
                nn.append(nid)
                notification.push(nn)
                $('.nn-list').append(nn)
            }
            notificationLength = normal.length
            //setInterval(updateNotification, 500)
        }
    })
}
function updateNotification() { // detect actions and send them as notifications
    var data = new FormData()
    data.append('username', username)
    $.ajax({
        type: 'post',
        url: 'apis/get_notification',
        data: data,
        processData: false,
        contentType: false,
        dataType: 'json',
        success: async function (response) {
            //console.log(response)
            var normal = response['normal']
            var unviewlength = response['norlength']
            if(unviewlength!=0) {
                document.title = '('+unviewlength+') '+ pageTitle
                $('.unview').text(unviewlength)
                $('.unview').css('display', 'block')
            }
            else {
                document.title = pageTitle
                $('.unview').css('display', 'none')
            }
            for(var i=0; i<notificationLength; i++) {
                var data = new FormData()
                data.append('username', normal[i]['_from'])
                data.append('col', 'name, url')
                var fromURL = ''
                var fromName = ''
                await $.ajax({
                    type: 'post',
                    url: 'apis/get_user_info',
                    data: data,
                    processData: false,
                    contentType: false,
                    dataType: 'json',
                    success: function (response) {
                        //response = $.parseJSON(response)
                        if(response[0] != undefined) {
                            fromURL = response[0]['url']
                            fromName = response[0]['name']
                        }
                    },
                    error: function() {
            
                    }
                })
                if(normal[i]['_read']=='yes')
                    notification[i].removeClass('read')
                else if(normal[i]['_read']=='no')
                    notification[i].addClass('read')
                notification[i].children().eq(0).text(normal[i]['_from'])
                if (normal[i]['content'] == 'friend request') { //actions added to notification list
                    var c = fromName + '寄了交友邀請給你'
                    notification[i].children().eq(1).text('friend')
                }
                else if (normal[i]['content'] == 'friend accept') {
                    var c = fromName + '接受了你的交友邀請'
                    notification[i].children().eq(1).text('friend')
                }
                else if (normal[i]['content'] == 'subscribe') {
                    var c = fromName + '訂閱了你的頻道'
                    var type = $('<div>', { class: 'nn-type', text: 'subscribe' })
                }
                else if (normal[i]['content'] == 'unsubscribe') {
                    var c = fromName + '取消訂閱了你的頻道'
                    var type = $('<div>', { class: 'nn-type', text: 'subscribe' })
                }
                else if (normal[i]['content'] == 'like') {
                    var c = fromName + '說你的影片讚'
                    var type = $('<div>', { class: 'nn-type', text: 'like' })
                }
                else if (normal[i]['content'] == 'unlike') {
                    var c = fromName + '收回了對你影片的讚'
                    var type = $('<div>', { class: 'nn-type', text: 'like' })
                }
                notification[i].children().eq(2).children().first().prop('src', fromURL)
                notification[i].children().eq(3).children().eq(0).text(c)
                notification[i].children().eq(3).children().eq(1).text(getMyTime(normal[i]['time']))
                notification[i].children().eq(4).text(normal[i]['id'])
            }
            for (var i = notificationLength; i < normal.length; i++) {
                var nn = $('<div>', {
                    class: 'nn',
                    click: function () {
                        var id = $(this).children().eq(0).text()
                        var type = $(this).children().eq(1).text()
                        var nid = $(this).children().eq(4).text()
                        var data = new FormData()
                        data.append('username', username)
                        data.append('read', '')
                        data.append('id', nid)
                        $.ajax({
                            type: 'post',
                            url: 'apis/set_notification',
                            data: data,
                            processData: false,
                            contentType: false,
                            success: function(response) {
                                console.log(response)
                                updateNotification()
                                if(type=='friend') {
                                    window.location.href = 'profile?u='+id
                                }
                            }
                        })
                    }
                })
                if(normal[i]['_read']=='yes')
                    nn.removeClass('read')
                else if(normal[i]['_read']=='no')
                    nn.addClass('read')
                var data = new FormData()
                data.append('username', normal[i]['_from'])
                data.append('col', 'name, url')
                var fromURL = ''
                var fromName = ''
                await $.ajax({
                    type: 'post',
                    url: 'apis/get_user_info',
                    data: data,
                    processData: false,
                    contentType: false,
                    dataType: 'json',
                    success: function (response) {
                        //response = $.parseJSON(response)
                        //console.log(response)
                        fromURL = response[0]['url']
                        fromName = response[0]['name']
                    },
                    error: function() {
            
                    }
                })
                var nid = $('<div>', {class: 'nn-id', text: normal[i]['id']})
                var id = $('<div>', {class: 'nn-id', text: normal[i]['_from']})
                var icon = $('<div>', {class: 'nn-icon'})
                var img = $('<img>').prop('src', fromURL)
                icon.append(img)
                var txt = $('<div>', { class: 'nn-txt' })
                if (normal[i]['content'] == 'friend request') {
                    var c = fromName + '寄了交友邀請給你'
                    var type = $('<div>', { class: 'nn-type', text: 'friend' })
                }
                else if (normal[i]['content'] == 'friend accept') {
                    var c = fromName + '接受了你的交友邀請'
                    var type = $('<div>', { class: 'nn-type', text: 'friend' })
                }
                var content = $('<div>', { class: 'nn-content', text: c })
                var time = $('<div>', { class: 'nn-time', text: getMyTime(normal[i]['time']) })
                txt.append(content)
                txt.append(time)
                nn.append(id)
                nn.append(type)
                nn.append(icon)
                nn.append(txt)
                nn.append(nid)
                notification.push(nn)
                $('.nn-list').append(nn)
            }
            notificationLength = normal.length
        }
    })
}
function updateNoteMessage() { // new messages detection
    console.log('updtae')
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
            var notemessagecount = res['unview']
            if(notemessagecount!=0) {
                //console.log(notemessagecount)
                $('.unviewmessage').text(notemessagecount)
                $('.unviewmessage').css('display', 'block')
            }
            else {
                $('.unviewmessage').css('display', 'none')
            }
            for(var i=0; i<noteMessageLength; i++) {
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
                    success: function (response) {
                        //console.log(response)
                        if(response[0] != undefined) {
                            uname = response[0]['name']
                            uurl = response[0]['url']
                        }
                    },
                    error: function() {
            
                    }
                })
                //console.log(uid)
                if(response[i]['_to']==username && response[i]['_read']=='no')
                    noteMessage[i].addClass('read')
                else {
                    noteMessage[i].removeClass('read')
                }
                noteMessage[i].children().eq(0).text(uid)
                noteMessage[i].children().eq(1).children().first().prop('src', uurl)
                noteMessage[i].children().eq(2).children().eq(0).text(uname)
                if (response[i]['content'] == '') {
                    noteMessage[i].children().eq(2).children().eq(1).text('(a videohhhhh!!!)')
                }
                else
                    noteMessage[i].children().eq(2).children().eq(1).text(response[i]['content'])
                noteMessage[i].children().eq(3).text(getMyTime(response[i]['send_time']))
                noteMessage[i].children().eq(4).text(response[i]['id'])
            }
            for (var i = noteMessageLength; i < response.length; i++) {
                var mn = $('<div>', {
                    class: 'mn',
                    click: function () {
                        var id = $(this).children().first().text()
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
                                location.href = 'messages?uid='+id
                            }
                        })
                    }
                })
                if(response[i]['_to']==username && response[i]['_read']=='no')
                    mn.addClass('read')
                else {
                    mn.removeClass('read')
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
                    success: function (response) {
                        //console.log(response)
                        uname = response[0]['name']
                        uurl = response[0]['url']
                    },
                    error: function() {
            
                    }
                })
                //console.log(uid)
                var mid = $('<div>', {class: 'mn-id', text: response[i]['id']})
                var id = $('<div>', {class: 'mn-id', text: uid})
                var icon = $('<div>', {class: 'mn-icon'})
                var img = $('<img>').prop('src', uurl)
                icon.append(img)
                var text = $('<div>', { class: 'mn-txt' })
                var name = $('<div>', { class: 'mn-name', text: uname })
                if (response[i]['content'] == '') {
                    var preview = $('<div>', { class: 'mn-preview', text: '(a videohhhhh!!!)' })
                }
                else
                    var preview = $('<div>', { class: 'mn-preview', text: response[i]['content'] })
                text.append(name)
                text.append(preview)
                var time = $('<div>', { class: 'm-time', text: getMyTime(response[i]['send_time']) })
                mn.append(id)
                mn.append(icon)
                mn.append(text)
                mn.append(time)
                mn.append(mid)
                noteMessage.push(mn)
                $('.message-list').append(message)
            }
            noteMessageLength = response.length
        },
        error: function (jqXHR, textStatus, errorThrown) {
            //console.log(textStatus)
        }
    })
}
function getNoteMessage() { // get messages
    var data = new FormData()
    data.append('username', username)
    $.ajax({
        type: 'post',
        url: 'apis/get_last_message',
        data: data,
        processData: false,
        contentType: false,
        dataType: 'json',
        success: async function(response) {
            //console.log(response)
            var notemessagecount = response['unview']
            if(notemessagecount!=0) {
                $('.unviewmessage').text(notemessagecount)
                $('.unviewmessage').css('display', 'block')
            }
            else {
                $('.unviewmessage').css('display', 'none')
            }
            var msg = response['message']
            //console.log(msg)
            $('.mn-list').empty()
            for (var i = 0; i < msg.length; i++) {
                var mn = $('<div>', {
                    class: 'mn',
                    click: function () {
                        var id = $(this).children().first().text()
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
                                location.href = 'messages?uid='+id
                            }
                        })
                    }
                })
                if(msg[i]['_to']==username && msg[i]['_read']=='no')
                    mn.addClass('read')
                else {
                    mn.removeClass('read')
                }
                var uid = msg[i]['_from']==username?msg[i]['_to']:msg[i]['_from']
                //console.log(uid)
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
                    success: function (response) {
                        //console.log(response)
                        if(response[0] != undefined) {
                            uname = response[0]['name']
                            uurl = response[0]['url']
                        }
                        //console.log(uname)
                    },
                    error: function() {
            
                    }
                })
                var mid = $('<div>', {class: 'mn-id', text: msg[i]['id']})
                var id = $('<div>', {class: 'mn-id', text: uid})
                var icon = $('<div>', {class: 'mn-icon'})
                var img = $('<img>').prop('src', uurl)
                icon.append(img)
                var text = $('<div>', { class: 'mn-txt' })
                var name = $('<div>', { class: 'mn-name', text: uname })
                if (msg[i]['content'] == '') {
                    var preview = $('<div>', { class: 'mn-preview', text: '(a videohhhhh!!!)' })
                }
                else
                    var preview = $('<div>', { class: 'mn-preview', text: msg[i]['content'] })
                text.append(name)
                text.append(preview)
                var time = $('<div>', { class: 'mn-time', text: getMyTime(msg[i]['send_time']) })
                mn.append(id)
                mn.append(icon)
                mn.append(text)
                mn.append(time)
                mn.append(mid)
                noteMessage.push(mn)
                $('.mn-list').append(mn)
            }
            noteMessageLength = msg.length
            //setInterval(updateNoteMessage, 500)
        },
        error: function (jqXHR, textStatus, errorThrown) {
            //console.log(textStatus)
        }
    })
}
function toggleDarkMode() { // chage theme detection
    if (darkMode) {
        goLightMode()
        var data = new FormData()
        data.append('dark', 'no')
        $.ajax({
            type: 'post',
            url: 'apis/set_dark_mode',
            contentType: false,
            processData: false,
            data: data,
            success: function (response) {
                console.log(response)
            }
        })
        darkMode = false
    }
    else {
        goDarkMode()
        var data = new FormData()
        data.append('dark', 'yes')
        $.ajax({
            type: 'post',
            url: 'apis/set_dark_mode',
            contentType: false,
            processData: false,
            data: data,
            success: function (response) {
                console.log(response)
            }
        })
        darkMode = true
    }
}
$(document).on('keydown', 'input', function (e) {
    if (e.target.className == 'search-txt' && e.keyCode == 13 && $('.search-txt').val() != '') {
        if (searchid == -1)
            window.location.href = 'result?search_query=' + $('.search-txt').val()
        else {
            $('.search-advice').children().eq(searchid).click()
        }
    }
})
$(document).click(function (e) {
    //console.log(getParentNode(e.target))
    if (getParentNode(e.target) == 'act-item user-icon') {
        $('.user-func').toggleClass('show')
    }
    else if (getParentNode(e.target) == null) {
        $('.user-func').removeClass('show')
    }
})
$('.act-logout').click(function () {
    window.location.href = 'go_logout'
})
$('.act-login').click(function () {
    window.location.href = 'login'
})
$('.act-register').click(function () {
    window.location.href = 'register'
})
$('.manage-btn').click(function() {
    window.location.href = 'account'
})
function getParentNode(node) { // user own info
    while (node != null) {
        //console.log(node)
        if (node.className == 'user-func show' || node.className == 'act-item user-icon') {
            return node.className
        }
        node = node.parentNode
    }
    return null
}
function getUserNavInfo() { // about user (on left bar)
    var data = new FormData()
    data.append('username', username)
    data.append('col', 'url, name, email, intro')
    $.ajax({
        type: 'post',
        url: 'apis/get_user_info',
        processData: false,
        contentType: false,
        data: data,
        dataType: 'json',
        success: function (response) {
            //console.log(response[0])
            var url = response[0]['url']
            $('.user-icon img').prop('src', url)
            $('.m-icon img').prop('src', url)
            $('.m-name').text(response[0]['name'])
            $('.m-email').text(response[0]['email'])
            $('.dicon img').prop('src', url)
            $('.aicon img').prop('src', url)
            $('.p-icon img').prop('src', url)
            $('.awelcome').text(response[0]['name']+', 歡迎使用')
            $('.intro').val(response[0]['intro'])
        },
        error: function() {

        }
    })
}
function toggleDrawer() {
    if (drawer) {
        closeDrawer()
    }
    else {
        openDrawer()
    }
}
function openDrawer() { // 
    $('.content').removeClass('content-big')
    $('.drawer-hide').css('display', 'block')
    var sidebar = $('.sidebar')
    sidebar.removeClass('sidebar-small')
    var item = $('.side-item-big')
    item.removeClass('side-item-big')
    item.addClass('side-item')
    drawer = true
    resize()
}
function closeDrawer() { // 
    $('.content').addClass('content-big')
    $('.drawer-hide').css('display', 'none')
    var sidebar = $('.sidebar')
    sidebar.addClass('sidebar-small')
    var item = $('.side-item')
    item.removeClass('side-item')
    item.addClass('side-item-big')
    drawer = false
    resize()
}
function getMyTime(dateStr) { // get the video post-time year-month-day-time
    var trans = ['週一', '週二', '週三', '週四', '週五', '週六', '週日']
    var today = new Date()
    var date = new Date(dateStr)
    if (today.getFullYear() > date.getFullYear()) {
        return date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate()
    }
    else if (today.getMonth() > date.getMonth()) {
        return (date.getMonth() + 1) + '/' + date.getDate()
    }
    else if (today.getDate() >= date.getDate() + 7) {
        return (date.getMonth() + 1) + '/' + date.getDate()
    }
    else if (today.getDate() > date.getDate()) {
        return trans[date.getDay()]
    }
    else if(date.getHours()<12){
        return '上午'+myMod(date.getHours())+':'+myMod(date.getMinutes())
    }
    else if(date.getHours()==12){
        return '下午'+myMod(date.getHours())+':'+myMod(date.getMinutes())
    }
    else {
        return '下午'+myMod(date.getHours()-12)+':'+myMod(date.getMinutes())
    }
}
function getMyTime2(dateStr) {
    var today = new Date()
    var date = new Date(dateStr)
    var d = ''
    if(today.getDate()>date.getDate()){
        d += date.getFullYear() + '年' + (date.getMonth()+1) + '月' + date.getDate() + '日 '
    }
    if(date.getHours()<12){
        d += '上午'+myMod(date.getHours())+':'+myMod(date.getMinutes())
    }
    else if(date.getHours()==12){
        d += '下午'+myMod(date.getHours())+':'+ myMod(date.getMinutes()) 
    }
    else {
        d += '下午'+myMod(date.getHours()-12)+':'+myMod(date.getMinutes())
    }
    return d
}
function myMod(time) {
    if(time==0)
        return '00'
    else if(Math.floor(time/10)==0) {
        var t = '0'+time
        return t
    }
    else
        return time
}