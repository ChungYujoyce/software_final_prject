var video_id = ''
var vuid = ''
var video
var isPlaying = false
var volume = 0.7
var muted = false
var duration = 0
var currentTime = 0
var buffer = 0
var timeout = 3
var init = false
var fullscreen = false
var lastPos = ''
var username = ''
var playList = ''
var index = -1
var otherVideo = []
var friend_id = ''
var likeCount = 0
$(document).ready(function() {// detect actions and call corresponding functions
    video_id = $('.video-id').text()
    //console.log(video_id)
    username = $('.session').text()
    playList = $('.play-list').text()
    if (playList != '')
        index = $('.index').text()
    //console.log(username)
    if (username == 'visitor') {
        $('.notlogin').fadeIn()
    }
    else {
        getUserNavInfo()
        $('.islogin').fadeIn()
        getNotification()
        getNoteMessage()
        getLikeState(true)
        getSubscribeState()
    }
    getVideo()
})
$('.big-play i').click(function () { // video playing detection
    video.muted = false
    video.play()
    $(this).css('display', 'none')
    $('.control').css('display', 'block')
    if (fullscreen)
        $('.video-title-hover').css('display', 'block')
    isPlaying = true
    $('.play').html('<i class="fas fa-pause"></i>')
    setInterval(function () {
        if (isPlaying) {
            timeout--
            if (timeout == 0) {
                if (lastPos == 'control') {
                    timeout = 3
                }
                else {
                    $('.control').fadeOut()
                    $('.video-title-hover').fadeOut()
                    $('.video').css('cursor', 'none')
                    $('.speed-selector').fadeOut()
                    isSpeedControl = false
                }
            }
        }
    }, 500)
    init = true
})
$('.video').dblclick(function (e) {
    if (e.target.tagName == 'VIDEO') {
        toggleFullScreen()
    }
})
$('.video').click(function (e) { // video playing detection
    if (e.target.tagName == 'VIDEO' && init) {
        if (isPlaying) {
            isPlaying = false
            video.pause()
            $('.play').html('<i class="fas fa-play"></i>')
            $('.control').css('display', 'block')
            if (fullscreen)
                $('.video-title-hover').css('display', 'block')
        }
        else {
            isPlaying = true
            video.play()
            $('.play').html('<i class="fas fa-pause"></i>')
            timeout = 3
        }
    }
})
var isDragProgress = false
var isDragVolume = false
var percent
var volpercent
$('.progress').mousedown(function (e) { // video progressing modify
    isDragProgress = true
    if (isPlaying)
        video.pause()
    var width = e.pageX - $('.progress-bar').offset().left
    percent = width / $('.progress-bar').width()
    if (percent < 0)
        percent = 0
    else if (percent > 1)
        percent = 0.99999
    //console.log(percent)
    $('.value').css('width', 100 * percent + '%')
    $('.handle').css('margin-left', 100 * percent + '%')
    //video.currentTime = percent*video.duration
})
$('.vol-ctrl').mousedown(function (e) { // volume change
    isDragVolume = true
    var width = e.pageX - $('.vol-bar').offset().left
    volpercent = width / $('.vol-bar').width()
    if (volpercent < 0)
        volpercent = 0
    else if (volpercent > 1)
        volpercent = 1
    //console.log(percent)
    $('.vol-value').css('width', 100 * volpercent + '%')
    $('.vol-handle').css('margin-left', 100 * volpercent + '%')
    video.volume = volpercent
    volume = volpercent
    muted = false
    $('.volume').html('<i class="fas fa-volume-up"></i>')
})
$(document).mousemove(function(e) {// dragging detection
    lastPos =  getParentNodeW(e.target)
    //console.log(lastPos)
    if (isDragProgress) { // drag to certain time point
        var width = e.pageX - $('.progress-bar').offset().left
        percent = width / $('.progress-bar').width()
        if (percent < 0)
            percent = 0
        else if (percent >= 1)
            percent = 0.99999
        $('.value').css('width', 100 * percent + '%')
        $('.handle').css('margin-left', 100 * percent + '%')
        //video.currentTime = percent*video.duration
    }
    if (isDragVolume) { // drag to certain volume
        isDragVolume = true
        var width = e.pageX - $('.vol-bar').offset().left
        volpercent = width / $('.vol-bar').width()
        if (volpercent < 0)
            volpercent = 0
        else if (volpercent > 1)
            volpercent = 1
        $('.vol-value').css('width', 100 * volpercent + '%')
        $('.vol-handle').css('margin-left', 100 * volpercent + '%')
        video.volume = volpercent
        volume = volpercent
        muted = false
        $('.volume').html('<i class="fas fa-volume-up"></i>')
    }
    if (isDragLLine) { // drag to certain beginning time point for sending video to other users
        isCutPlaying = false
        cutVideo.pause()
        $('.try').html('<i class="far fa-play-circle"></i>')
        var width = e.pageX - $('.cut-view').offset().left
        lpercent = width / $('.cut-view').width()
        if (lpercent < 0)
            lpercent = 0
        else if (lpercent >= rpercent)
            lpercent = rpercent
        begin = lpercent * cutVideo.duration
        cutVideo.currentTime = begin
        //console.log(begin)
        $('.ltime').text(myFormatter(begin))
        $('.ltime').css('left', 100 * lpercent + '%')
        $('.lline').css('left', 100 * lpercent + '%')
        $('.preview-time').css({ 'left': 100 * lpercent + '%', 'width': '0' })
    }
    if (isDragRLine) { // drag to certain ending time point for sending video to other users
        isCutPlaying = false
        cutVideo.pause()
        $('.try').html('<i class="far fa-play-circle"></i>')
        var width = e.pageX - $('.cut-view').offset().left
        rpercent = width / $('.cut-view').width()
        if (rpercent <= lpercent)
            rpercent = lpercent
        else if (rpercent >= 1)
            rpercent = 0.99999
        end = rpercent * cutVideo.duration
        cutVideo.currentTime = end
        //console.log(end)
        $('.rtime').text(myFormatter(end))
        $('.rtime').css('left', 100 * rpercent + '%')
        $('.rline').css('left', 100 * rpercent + '%')
        $('.preview-time').css({ 'width': '0' })
    }
})
$(document).mouseup(function () { // mouse up detection
    if (isDragProgress) {
        isDragProgress = false
        video.currentTime = percent * video.duration
        if (isPlaying)
            video.play()
    }
    if (isDragVolume) {
        isDragVolume = false
    }
    if (isDragLLine) {
        isDragLLine = false
    }
    if (isDragRLine) {
        isDragRLine = false
    }
})
$('.play').click(function () { // play button detection
    if (isPlaying) {
        isPlaying = false
        video.pause()
        $('.play').html('<i class="fas fa-play"></i>')
    }
    else {
        isPlaying = true
        video.play()
        $('.play').html('<i class="fas fa-pause"></i>')
        timeout = 3
    }
})
$('.next').click(function () {

})
$('.volume').click(function () {
    if (muted) {
        video.volume = volume
        muted = false
        $(this).html('<i class="fas fa-volume-up"></i>')
    }
    else {
        video.volume = 0
        muted = true
        $(this).html('<i class="fas fa-volume-mute"></i>')
    }
})
var isSpeedControl = false
$('.speed').click(function () { // speed modify
    if (isSpeedControl) {
        $('.speed-selector').css('display', 'none')
        isSpeedControl = false
    }
    else {
        $('.speed-selector').css('display', 'block')
        isSpeedControl = true
    }
})
$('.aspeed').click(function () {
    var speed = $(this).children().eq(1).text()
    //console.log(speed)
    for (var i = 0; i < $(this).siblings().length; i++) {
        $(this).siblings().eq(i).children().first().removeClass('fa-check')
    }
    $(this).children().first().addClass('fa-check')
    if (speed == '正常') {
        video.playbackRate = 1.0
    }
    else {
        video.playbackRate = parseFloat(speed)
    }
})
$('.full').click(toggleFullScreen)
var floating = false
$('.pip').click(function () {
    if (!document.pictureInPictureElement) {
        video.requestPictureInPicture()
            .catch(error => {
                // 視頻無法進入畫中畫模式
            })
    }
    else {
        document.exitPictureInPicture()
            .catch(error => {
                // 視頻無法退出畫中畫模式
            })
    }
})
//-------------- cut video ---------------
var isDragLLine = false
var isDragRLine = false
var lpercent = 0
var rpercent = 1
var cutVideo = $('.cut-view video').get(0)
var begin = 0
var end = 0
var isCutPlaying = false
$('.share-video').click(function () {
    $('.share-view').css('display', 'block')
    getFriendList('')
    cutVideo.src = video.src
    isCutPlaying = false
    lpercent = 0
    rpercent = 1
    begin = 0
    $('.ltime').text(myFormatter(0))
    cutVideo.onloadedmetadata = function () {
        end = cutVideo.duration
        $('.rtime').text(myFormatter(end))
    }
    cutVideo.ontimeupdate = function () {
        var width = $('.cut-view').width() * (cutVideo.currentTime - parseFloat(begin)) / cutVideo.duration
        //console.log(cutVideo.currentTime - parseFloat(begin)/cutVideo.duration)
        if (isCutPlaying)
            $('.preview-time').css('width', width + 'px')
        if (cutVideo.currentTime >= parseFloat(end)) {
            cutVideo.pause()
        }
    }
})
$('.close-btn').click(function () { // create display on html
    $('.share-view').css('display', 'none')
    $('.try').html('<i class="far fa-play-circle"></i>')
    cutVideo.pause()
})
$('.lline').mousedown(function () {
    isDragLLine = true
    isCutPlaying = false
    cutVideo.pause()
    $('.try').html('<i class="far fa-play-circle"></i>')
})
$('.rline').mousedown(function () {
    isDragRLine = true
    isCutPlaying = false
    cutVideo.pause()
    $('.try').html('<i class="far fa-play-circle"></i>')
})
$('.try').click(function () {
    cutVideo.currentTime = parseFloat(begin)
    //console.log(parseFloat(begin))
    //console.log(parseFloat(end))
    if (isCutPlaying) {
        isCutPlaying = false
        cutVideo.pause()
        $('.try').html('<i class="far fa-play-circle"></i>')
        $('.preview-time').css('width', '0')
    }
    else {
        isCutPlaying = true
        cutVideo.play()
        $('.try').html('<i class="far fa-pause-circle"></i>')
    }
})
$('.send').click(function () { // send sharing video info to certain user
    //console.log('begin: '+begin)
    //console.log('end: '+end)
    var data = new FormData()
    data.append('from', username)
    data.append('to', friend_id)
    data.append('type', 'video')
    data.append('content', '')
    data.append('video_id', video_id)
    data.append('begin', begin)
    data.append('end', end)
    $.ajax({
        type: 'post',
        url: 'apis/send_message',
        data: data,
        processData: false,
        contentType: false,
        success: function (response) {
            console.log(response)
            $('.share-view').fadeOut()
        }
    })
})
//------------------------------------------
$('.video').hover(function () {
    if (isPlaying && init) {
        $('.control').css('display', 'block')
        if (fullscreen)
            $('.video-title-hover').css('display', 'block')
    }
}, function () {
    if (isPlaying) {
        setTimeout(function () {
            $('.control').fadeOut()
            $('.video-title-hover').fadeOut()
            $('.speed-selector').fadeOut()
            isSpeedControl = false
        }, 1500)
    }
})
$('.video').mousemove(function () {
    if (isPlaying && init) {
        $('.control').css('display', 'block')
        if (fullscreen)
            $('.video-title-hover').css('display', 'block')
        timeout = 3
    }
    $(this).css('cursor', 'auto')
})
$(document).keydown(function (e) {
    //e.preventDefault()
    if (!$('.search-txt').is(':focus') && init) {
        switch (e.keyCode) {
            case 32:
                e.preventDefault()
                if (isPlaying) {
                    isPlaying = false
                    video.pause()
                    $('.play').html('<i class="fas fa-play"></i>')
                }
                else {
                    isPlaying = true
                    video.play()
                    $('.play').html('<i class="fas fa-pause"></i>')
                }
                break
            case 37:
                video.currentTime -= 5
                if (isPlaying) {
                    video.play()
                }
                if (video.currentTime > video.duration)
                    video.currentTime = video.duration
                break
            case 39:
                video.currentTime += 5
                if (video.currentTime < 0)
                    video.currentTime = 0
                break
        }
    }
})
//----------function--------------//
$('.scb-btn').click(function () {
    var data = new FormData()
    data.append('username', username)
    data.append('video_id', video_id)
    $.ajax({
        type: 'post',
        url: 'apis/subscribe',
        data: data,
        processData: false,
        contentType: false,
        success: function (response) {
            console.log(response)
            getSubscribeState()
        }
    })
})
$('.like-video').click(function () {
    var data = new FormData()
    data.append('username', username)
    data.append('update', '')
    data.append('video_id', video_id)
    $.ajax({
        type: 'post',
        url: 'apis/like',
        data: data,
        processData: false,
        contentType: false,
        success: function(response) {
            //console.log(response)
            getLikeState(false)
            sendLikeNotification(username, vuid)
        }
    })
})
function getLikeState(init) {// get likes and display (color and likes number)
    var data = new FormData()
    data.append('username', username)
    data.append('get', '')
    data.append('video_id', video_id)
    $.ajax({
        type: 'post',
        url: 'apis/like',
        data: data,
        processData: false,
        contentType: false,
        success: function (response) {
            //console.log(response)
            if(response=='yes') {
                if(!init) {
                    likeCount++
                    console.log(likeCount)
                    $('.like-video span').text(likeCount)
                }
                $('.like-video').css('color', 'red')
            }
            else if(response=='no'){
                if(!init) {
                    likeCount--
                    $('.like-video span').text(likeCount)
                }
                $('.like-video').css('color', 'gray')
            }
        }
    })
}
function getSubscribeState() { // get subscribe and change the display of subscibibg button
    var data = new FormData()
    data.append('username', username)
    data.append('get', '')
    data.append('video_id', video_id)
    $.ajax({
        type: 'post',
        url: 'apis/subscribe',
        data: data,
        processData: false,
        contentType: false,
        success: function (response) {
            //console.log(response)
            if (response == 'yes') {
                $('.scb-btn').empty()
                var i = $('<i>', { class: 'fas fa-check' })
                var t = $('<span>', { text: '已訂閱' })
                $('.scb-btn').append(i)
                $('.scb-btn').append(t)
            }
            else if (response == 'no') {
                $('.scb-btn').empty()
                var i = $('<i>', { class: 'fas fa-bell' })
                var t = $('<span>', { text: '訂閱' })
                $('.scb-btn').append(i)
                $('.scb-btn').append(t)
            }
        }
    })
}
//---------------------------------
var whole = false
$('.show-whole').click(function () {
    if (whole) {
        $('.video-desc').css('max-height', '150px')
        $(this).text('顯示完整資訊')
        whole = false
    }
    else {
        $('.video-desc').css('max-height', 'none')
        $(this).text('只顯示部份資訊')
        whole = true
    }
})
//------------reply function-----------------------
$('.dinput').keyup(function(e) {
    if(e.keyCode==13 && $(this).val()!='') {
        var data = new FormData()
        data.append('username', username)
        data.append('content', $(this).val())
        data.append('video_id', video_id)
        $.ajax({
            type: 'post',
            url: 'apis/add_reply',
            data: data,
            processData: false,
            contentType: false,
            success: function(response) {
                //console.log(response)
                $('.dinput').val('')
                var data = new FormData()
                data.append('video_id', video_id)
                $.ajax({
                    type: 'post',
                    url: 'apis/get_video',
                    data: data,
                    processData: false,
                    contentType: false,
                    dataType : 'json',
                    success: function(response) {
                        var videoInfo = response[0]
                        getReply($.parseJSON(videoInfo['reply']))
                    }
                })
            }
        })
    }
})
async function getReply(list) {
    $('.reply-list').empty()
    $('.reply-total').text(list.length + ' 則留言')
    for(var i=0; i<list.length; i++) {
        var user = list[i]['username']
        var uurl = ''
        var uname = ''
        var data = new FormData()
        data.append('username', user)
        data.append('col', 'name, url')
        await $.ajax({
            type: 'post',
            url: 'apis/get_user_info',
            data: data,
            processData: false,
            contentType: false,
            dataType : 'json',
            success: function(response) {
                uname = response[0]['name']
                uurl = response[0]['url']
            }
        })
        var reply = $('<div>', {class: 'a-reply'})
        var icon = $('<div>', {class: 'ricon'})
        var img = $('<img>').prop('src', uurl)
        icon.append(img)
        var txt = $('<div>', {class: 'rtxt'})
        var info = $('<div>', {class: 'rinfo'})
        var name = $('<div>', {class: 'rname', text: uname})
        var time = $('<div>', {class: 'r-time', text: getMyTime(list[i]['time'])})
        info.append(name)
        info.append(time)
        var content = $('<div>', {class: 'rcontent', text: list[i]['content']})
        txt.append(info)
        txt.append(content)
        reply.append(icon)
        reply.append(txt)
        $('.reply-list').append(reply)
    }
}
function getVideo() {
    var data = new FormData()
    data.append('video_id', video_id)
    //console.log(video_id)
    $.ajax({
        type: 'post',
        url: 'apis/get_video',
        data: data,
        processData: false,
        contentType: false,
        dataType: 'json',
        success: function (response) {
            var videoInfo = response[0]
            //console.log(videoInfo)
            initVideo(videoInfo)
            getUpdateUser(videoInfo['upload_user'])
            getReply($.parseJSON(videoInfo['reply']))
            $('.vusr-name').click(function() {
                location.href = 'profile?u='+videoInfo['upload_user']
            })
        }
    })
    if (playList != '') {
        getLikeVideo()
    }
    else {
        data.append('username', username)
        $.ajax({
            type: 'post',
            url: 'apis/get_other_video',
            data: data,
            processData: false,
            contentType: false,
            dataType: 'json',
            success: async function (response) {
                otherVideo = response
                //console.log(otherVideo)
                $('.other-video').empty()
                for (var i = 0; i < otherVideo.length; i++) {
                    var card = $('<div>', {
                        class: 'video-card',
                        click: function () {
                            var video_id = $(this).children().first().text()
                            //console.log(video_id)
                            window.location.href = 'watch?v=' + video_id
                        }
                    })
                    var uname = ''
                    var data = new FormData()
                    data.append('username', otherVideo[i]['upload_user'])
                    data.append('col', 'name')
                    await $.ajax({
                        type: 'post',
                        url: 'apis/get_user_info',
                        processData: false,
                        contentType: false,
                        dataType: 'json',
                        data: data,
                        success: function (response) {
                            //console.log(response)
                            uname = response[0]['name']
                        }
                    })
                    // videos shown on main page
                    var id = $('<div>', { class: 'video-id', text: otherVideo[i]['video_id'] })
                    var pic = $('<div>', { class: 'v-pic' })
                    var img = $('<img>').prop('src', 'videos/snapshots/' + otherVideo[i]['video_id'] + '.png')
                    pic.append(img)
                    var txt = $('<div>', { class: 'v-txt' })
                    var name = $('<div>', { class: 'v-name', text: otherVideo[i]['name'] })
                    var owner = $('<div>', { class: 'v-owner', text: uname })
                    txt.append(name)
                    txt.append(owner)
                    card.append(id)
                    card.append(pic)
                    card.append(txt)
                    var border = $('<div>', { class: 'other-border' })
                    $('.other-video').append(card)
                    $('.other-video').append(border)
                }
            }
        })
    }
}
$('.share-input').keyup(function (e) {
    //e.preventDefault()
    key = $(this).val()
    getFriendList(key)
    //console.log(key)
})
function getFriendList(key) { // get friends info and show on page
    var data = new FormData()
    data.append('key', key)
    data.append('begin', true)
    data.append('username', username)
    data.append('friend', '')
    $.ajax({
        type: 'post',
        url: 'apis/search_db',
        data: data,
        processData: false,
        contentType: false,
        dataType: 'json',
        success: function (response) {
            searchList = response
            console.log(searchList)
            $('.friends').empty()
            for (var i = 0; i < searchList.length; i++) {
                var friend = $('<div>', {
                    class: 'friend',
                    click: function () { // create friends cards
                        var id = $(this).children().first().text()
                        var name = $(this).children().eq(2).text()
                        $(this).children().eq(1).css({
                            'width': '44px',
                            'height': '44px',
                            'border': '3px solid #ffa502'
                        })
                        $(this).siblings().children().eq(1).css({
                            'width': '50px',
                            'height': '50px',
                            'border': 'none'
                        })
                        $(this).children().eq(2).css('color', '#ffa502')
                        $(this).siblings().children().eq(2).css('color', 'black')
                        $('.share-input').val(name)
                        friend_id = id
                        console.log(friend_id)
                    }
                })
                var id = $('<div>', { class: 'friend-id', text: searchList[i]['username'] })
                var icon = $('<div>', { class: 'friend-icon' })
                var img = $('<img>').prop('src', searchList[i]['url'])
                icon.append(img)
                var name = $('<div>', { class: 'friend-name', text: searchList[i]['name'] })
                friend.append(id)
                friend.append(icon)
                friend.append(name)
                $('.friends').append(friend)
            }
        }
    })
}
function initVideo(info) { // get info about the video (likes wath times...) and show on page
    vuid = info['upload_user']
    document.title = info['name']
    $('.video-title-hover').text(info['name'])
    $('.video-title').text(info['name'])
    $('.video-desc').text(info['description'])
    $('.watched-count').text('觀看次數: '+info['view_count']+'次')
    $('.like-video span').text(info['like_count'])
    likeCount = info['like_count']
    //console.log(d)
    $('.upload-time').text('發布日期: ' + formatDate(info['upload_time']))
    video = $('video').get(0)
    video.src = 'videos/' + info['video_id'] + '.' + info['ext']
    video.pause()
    duration = video.duration
    //console.log(video.duration)
    video.ontimeupdate = function () { // show video playing time right now
        if (!isDragProgress) {
            var percent = 100 * video.currentTime / duration
            //console.log(video.currentTime)
            $('.value').css('width', percent + '%')
            $('.handle').css('margin-left', percent + '%')
            $('.position').text(myFormatter(video.currentTime) + ' / ' + myFormatter(duration))
            buffer = video.buffered.end(0)
            //console.log(buffer)
            $('.buffer').css('width', 97.5 * buffer / duration + '%')
        }
    }
    video.onloadedmetadata = function () { // default video setting
        //console.log(video.duration)
        duration = video.duration
        video.volume = 0.7
        video.defaultPlaybackRate = 2.0
        $('.position').text('0:00 / ' + myFormatter(duration))
    }
    video.onended = function () { // ending video display
        var data = new FormData()
        data.append('username', username)
        data.append('video_id', video_id)
        $.ajax({
            type: 'post',
            url: 'apis/video_ended',
            data: data,
            processData: false,
            contentType: false,
            success: function (response) {
                console.log(response)
            }
        })
    }
}
function getLikeVideo() { // get videos users have add as liked to their own page
    $('.like-content').fadeIn()
    var data = new FormData()
    data.append('username', playList)
    $.ajax({
        type: 'post',
        url: 'apis/get_like_list',
        data: data,
        processData: false,
        contentType: false,
        dataType: 'json',
        success: async function (response) {
            console.log(response)
            var otherVideo = response
            $('.like-list').empty()
            for (var i = 0; i < otherVideo.length; i++) { // list them
                var card = $('<div>', {
                    class: 'card',
                    click: function () {
                        var video_id = $(this).children().first().text()
                        var index = $(this).children().eq(1).text()
                        //console.log(video_id)
                        window.location.href = 'watch?v=' + video_id + '&playList=' + username + '&index=' + index
                    }
                })
                if (i + 1 == index) {
                    card.addClass('c-selected')
                }
                var uname = ''
                var data = new FormData()
                data.append('username', otherVideo[i]['upload_user'])
                data.append('col', 'name')
                await $.ajax({ // get info
                    type: 'post',
                    url: 'apis/get_user_info',
                    processData: false,
                    contentType: false,
                    dataType: 'json',
                    data: data,
                    success: function (response) {
                        uname = response[0]['name']
                    }
                })
                // show them on html
                var id = $('<div>', { class: 'video-id', text: otherVideo[i]['video_id'] })
                var ind = $('<div>', { class: 'id', text: i + 1 })
                var pic = $('<div>', { class: 'card-preview' })
                var img = $('<img>').prop('src', 'videos/snapshots/' + otherVideo[i]['video_id'] + '.png')
                pic.append(img)
                var txt = $('<div>', { class: 'card-txt' })
                var name = $('<div>', { class: 'card-name', text: otherVideo[i]['name'] })
                var owner = $('<div>', { class: 'card-owner', text: uname })
                txt.append(name)
                txt.append(owner)
                card.append(id)
                card.append(ind)
                card.append(pic)
                card.append(txt)
                $('.like-list').append(card)
            }
        }
    })
}
function getUpdateUser(username) { // users' own information (can be modified)
    var data = new FormData()
    data.append('username', username)
    data.append('col', 'name, url')
    //console.log(video_id)
    $.ajax({
        type: 'post',
        url: 'apis/get_user_info',
        data: data,
        processData: false,
        contentType: false,
        dataType: 'json',
        success: function (response) {
            var userInfo = response[0]
            //console.log(userInfo)
            $('.vusr-icon img').prop('src', userInfo['url'])
            $('.vusr-name').text(userInfo['name'])
        }
    })
}
function getParentNodeW(node) {
    //console.log(node)
    while(node != null) {
        if(node.className == 'control') {
            return 'control'
        }
        node = node.parentNode
    }
    return null
}
function toggleFullScreen() { // turn to fullscreen mode
    if (!document.fullscreenElement &&    // alternative standard method
        !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {  // current working methods
        if (video.requestFullscreen) {
            document.getElementById('container').requestFullscreen()
        }
        else if (video.msRequestFullscreen) {
            $('.video').msRequestFullscreen()
        }
        else if (video.mozRequestFullScreen) {
            $('.video').mozRequestFullScreen()
        }
        else if (video.webkitRequestFullscreen) {
            $('.video').webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT)
        }
        if (init)
            $('.video-title-hover').css('display', 'block')
        $('.full').html('<i class="fas fa-compress"></i>')
        fullscreen = true
    }
    else { // leaving fullscreen mode
        if (document.exitFullscreen) {
            document.exitFullscreen()
        }
        else if (document.msExitFullscreen) {
            document.msExitFullscreen()
        }
        else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen()
        }
        else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen()
        }
        $('.full').html('<i class="fas fa-expand"></i>')
        $('.video-title-hover').css('display', 'none')
        fullscreen = false
    }
} // detect actions
document.addEventListener('fullscreenchange', exitHandler);
document.addEventListener('webkitfullscreenchange', exitHandler);
document.addEventListener('mozfullscreenchange', exitHandler);
document.addEventListener('MSFullscreenChange', exitHandler);

function exitHandler() {
    if (!document.fullscreenElement && !document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
        $('.full').html('<i class="fas fa-expand"></i>')
        $('.video-title-hover').css('display', 'none')
        fullscreen = false
    }
}
function formatDate(date) {
    var d = new Date(date)
    return d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日'
}
function myFormatter(seconds) { // video uploading time display
    var hour = Math.floor(seconds / 3600);
    var minute = Math.floor((seconds % 3600) / 60);
    var second = Math.floor(seconds % 60);
    var h = hour > 9 ? hour.toString() : '0' + hour.toString();
    var m = minute > 9 ? minute.toString() : '0' + minute.toString();
    var s = second > 9 ? second.toString() : '0' + second.toString();
    if (h != '00') {
        return h + ':' + m + ':' + s;
    }
    else
        return m + ':' + s;
}
function viewFormatter(count) {
    if (count >= 1000) {
        return count / 1000 + ',' + count % 1000
    }
    else
        return count
}
function goDarkMode() {
    $('body').css({
        'color': 'white',
        'background': '#121212'
    })
}
function goLightMode() {
    $('body').css({
        'color': 'black',
        'background': 'white'
    })
}