var username = 'visitor'
var uid = ''
var page = 1
var ptop = 0
var pleft = 0
$(document).ready(function() {
    username = $('.session').text()
    uid = $('.uid').text()
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
        getSubscribeState()
    }
    if(uid!=username) {
        getFriendState(username, uid)
    }
    getUserInfo()
    getUserVideo()
    ptop = $('.usr-info').offset().top+ parseInt($('.usr-info').css('height')) //$('.pagination').offset().top
    //console.log(ptop)
    pleft = $('.content').offset().left
    resize()
})
$('.subscribe-btn').click(function() {
    var data = new FormData()
    data.append('username', username)
    data.append('uid', uid)
    $.ajax({
        type: 'post',
        url: 'apis/subscribe',
        data: data,
        processData: false,
        contentType: false,
        success: function(response) {
            console.log(response)
            sendSubscribeNotification(username, uid)
        }
    })
})
function getSubscribeState() {
    if(uid!=username) {
        $('.subscribe-btn').fadeIn()
        var data = new FormData()
        data.append('username', username)
        data.append('get', '')
        data.append('uid', uid)
        $.ajax({
            type: 'post',
            url: 'apis/subscribe',
            data: data,
            processData: false,
            contentType: false,
            success: function(response) {
                //console.log(response)
                if(response=='yes') {
                    $('.subscribe-btn').empty()
                    var i = $('<i>', {class: 'fas fa-check'})
                    var t = $('<span>', {text: '已訂閱'})
                    $('.subscribe-btn').append(i)
                    $('.subscribe-btn').append(t)
                }
                else if(response=='no'){
                    $('.subscribe-btn').empty()
                    var i = $('<i>', {class: 'fas fa-bell'})
                    var t = $('<span>', {text: '訂閱'})
                    $('.subscribe-btn').append(i)
                    $('.subscribe-btn').append(t)
                }
            }
        })
    }
}
function getUserInfo() {
    var data = new FormData()
    data.append('uid', uid)
    //console.log(video_id)
    $.ajax({
        type: 'post',
        url: 'apis/get_user_info',
        data: data,
        processData: false,
        contentType: false,
        dataType : 'json',
        success: function(response) {
            var userInfo = response[0]
            //console.log(userInfo)
            $('.cover img').prop('src', userInfo['cover_url'])
            $('.usr-icon-p img').prop('src', userInfo['url'])
            $('.usr-name').text(userInfo['name'])
            document.title = userInfo['name'] + ' - Videoh'
        }
    })
}
function getUserVideo() {
    var data = new FormData()
    data.append('uid', uid)
    //console.log(video_id)
    $.ajax({
        type: 'post',
        url: 'apis/get_user_video',
        data: data,
        processData: false,
        contentType: false,
        dataType : 'json',
        success: function(response) {
            var cardList = response
            //console.log(cardList)
            $('.video-list').empty()
            for(var i=0; i<cardList.length; i++) {
                var card = $('<div>', {
                    class: 'video-card',
                    click: function() {
                        var video_id = $(this).children().first().text()
                        //console.log(video_id)
                        window.location.href = 'watch?v='+video_id
                    }
                })
                var id = $('<div>', {class: 'video-id', text: cardList[i]['video_id']})
                var preview = $('<div>', {class: 'card-preview'})
                var img = $('<img>').prop('src', 'videos/snapshots/'+cardList[i]['video_id']+'.png')
                preview.append(img)
                var title = $('<div>', {class: 'video-title', text: cardList[i]['name']})
                card.append(id)
                card.append(preview)
                card.append(title)
                $('.video-list').append(card)
            }
        }
    })
}
function getFriendState(username, uid) {
    var data = new FormData()
    data.append('username', username)
    data.append('uid', uid)
    $.ajax({
        type: 'post',
        url: 'apis/get_friend_state',
        data: data,
        processData: false,
        contentType: false,
        success: function(response) {
            //console.log(response)
            if(response=='not friend') {
                $('.add').fadeIn()
                $('.added').css('display', 'none')
                $('.response').css('display', 'none')
                $('.isfriend').css('display', 'none')
            }
            else if(response=='request') {
                $('.added').fadeIn()
                $('.add').css('display', 'none')
                $('.response').css('display', 'none')
                $('.isfriend').css('display', 'none')
            }
            else if(response=='response') {
                $('.response').fadeIn()
                $('.added').css('display', 'none')
                $('.add').css('display', 'none')
                $('.isfriend').css('display', 'none')
            }
            else if(response=='friend') {
                $('.isfriend').fadeIn()
                $('.added').css('display', 'none')
                $('.response').css('display', 'none')
                $('.add').css('display', 'none')
            }
        }
    })
}
function sendFriendRequest(username, uid) {
    var data = new FormData()
    data.append('username', username)
    data.append('uid', uid)
    $.ajax({
        type: 'post',
        url: 'apis/friend_request',
        data: data,
        processData: false,
        contentType: false,
        success: function(response) {
            console.log(response)
            sendFriend(username, uid)
        }
    })
}
function acceptFriendRequest(username, uid) {
    var data = new FormData()
    data.append('username', username)
    data.append('uid', uid)
    $.ajax({
        type: 'post',
        url: 'apis/accept_request',
        data: data,
        processData: false,
        contentType: false,
        success: function(response) {
            console.log(response)
            sendFriend(username, uid)
        }
    })
}
function resize() {
    //console.log('fsdjoi')
    pleft = $('.content').offset().left
    if($(window).scrollTop()+60 >= ptop) {
        $('.pagination').css({'position': 'fixed', 'top': '60px', 'left': pleft})
    }
    else {
        $('.pagination').css({'position': ''})
    }
}
function goLightMode() {

}
function goDarkMode() {
    
}
$(window).resize(resize)
$(window).scroll(function() {
    var offset = $(window).scrollTop()
    if(offset<=300) {
        $('.cover').css({
            'opacity': 1-offset/300
        })
    }
})
$(document).scroll(function() {
    //console.log(ptop)
    if($(window).scrollTop()+60 >= ptop) {
        $('.pagination').css({'position': 'fixed', 'top': '60px', 'left': pleft})
    }
    else {
        $('.pagination').css({'position': ''})
    }
})
$('.add').click(function() {
    if(username != uid) {
        sendFriendRequest(username, uid) // username send to uid
    }
})
$('.response').click(function() {
    if(username != uid) {
        acceptFriendRequest(username, uid) // username send to uid
    }
})
$('.isfriend').click(function() {
    $('.send-box').css('display', 'block')
})
$('.send-btn').click(function() {
    var data = new FormData()
    data.append('from', username)
    data.append('to', uid)
    data.append('type', 'text')
    data.append('content', $('.send-input').val())
    $.ajax({
        type: 'post',
        url: 'apis/send_message',
        data: data,
        processData: false,
        contentType: false,
        success: function(response) {
            console.log(response)
            window.location.href = 'messages'
        }
    })
})
$('.close-btn').click(function() {
    $('.send-box').css('display', 'none')
})
$('.p-video').click(function() {
    page = 1
    $('.tablayout').css('-webkit-transform', '')
    $('.tab-line').animate({'margin-left': '0'})
    $(this).addClass('p-selected')
    $(this).siblings().removeClass('p-selected')
    getUserVideo()
})
$('.p-social').click(function() {
    page = 2
    $('.tablayout').css('-webkit-transform', 'translate(-33.4%, 0)')
    $('.tab-line').animate({'margin-left': '90px'})
    $(this).addClass('p-selected')
    $(this).siblings().removeClass('p-selected')
    getSocial()
})
$('.p-profile').click(function() {
    page = 3
    $('.tablayout').css('-webkit-transform', 'translate(-66.7%, 0)')
    $('.tab-line').animate({'margin-left': '180px'})
    $(this).addClass('p-selected')
    $(this).siblings().removeClass('p-selected')
    getProfile()
})
function getHomePage() {

}
function getProfile() {
    var data = new FormData()
    data.append('username', uid)
    data.append('col', 'intro')
    $.ajax({
        type: 'post',
        url: 'apis/get_user_info',
        data: data,
        processData: false,
        contentType: false,
        dataType: 'json',
        success: function(response) {
            console.log(response)
            $('.ccontent').text(response[0]['intro'])
        }
    })
}
function getSocial() {
    var data = new FormData()
    data.append('username', uid)
    $.ajax({
        type: 'post',
        url: 'apis/get_social',
        data: data,
        processData: false,
        contentType: false,
        dataType: 'json',
        success: async function(response) {
            //console.log(response)
            $('.noti-list').empty()
            for(var i=response.length-1; i>=0; i--) {
                var noti = $('<div>', {class:'anoti'})
                var uid = response[i]['_from']
                var fname = ''
                var data = new FormData()
                data.append('username', uid)
                data.append('col', 'name')
                await $.ajax({
                    type: 'post',
                    url: 'apis/get_user_info',
                    data: data,
                    processData: false,
                    contentType: false,
                    dataType: 'json',
                    success: function(response) {
                        fname = response[0]['name']
                    }
                })
                var from = $('<span>', {class: 'nfrom', text: fname})
                var fid = $('<div>', {class: 'fid', text: uid})
                from.append(fid)
                if(response[i]['content']=='like') {
                    var title = $('<div>', {class: 'ntitle'})
                    title.append(from)
                    var nvid = $('<span>', {class: 'nvid',text: '影片'})
                    var vid = $('<div>', {class: 'fid', text: response[i]['_link']})
                    nvid.append(vid)
                    title.html(title.html()+'說此人的')
                    title.append(nvid)
                    title.html(title.html()+'讚')
                }
                else if(response[i]['content']=='subscribe') {
                    var title = $('<div>', {class: 'ntitle'})
                    title.append(from)
                    title.html(title.html()+'訂閱了此人的頻道')
                }
                else if(response[i]['content']=='friend accept') {
                    var title = $('<div>', {class: 'ntitle'})
                    title.append(from)
                    title.html(title.html()+'與此人成為了朋友')
                }
                var icon = $('<div>', {class: 'nicon'})
                var time = $('<div>', {class: 'ntime', text: getMyTime(response[i]['time'])})
                noti.append(title)
                noti.append(icon)
                noti.append(time)
                $('.noti-list').append(noti)
            }
            $('.nfrom').click(function() {
                var id = $(this).children().first().text()
                location.href = 'profile?u='+id
            })
            $('.nvid').click(function() {
                var id = $(this).children().first().text()
                location.href = 'watch?v='+id
            })
        }
    })
}