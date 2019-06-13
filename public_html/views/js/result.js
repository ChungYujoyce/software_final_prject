var username = 'visitor'
var searchQuery = ''
var page = 1
var ptop = 0
var pleft = 0
var friendList = []
$(document).ready(function() {
    username = $('.session').text()
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
    searchQuery = $('.search-query').text()
    $('.search-txt').val(searchQuery)
    document.title = searchQuery + ' - Videoh'
    //console.log(searchQuery)
    search()
    ptop = $('.border').offset().top+ parseInt($('.border').css('height')) //$('.pagination').offset().top
    //console.log(ptop)
    pleft = $('.content').offset().left
    resize()
})
function search() {
    var data = new FormData()
    data.append('key', searchQuery)
    data.append('username', username)
    $.ajax({
        type: 'post',
        url: 'apis/search_db',
        data: data,
        processData: false,
        contentType: false,
        dataType : 'json',
        success: function(response) {
            var result = response
            //console.log(result)
            getPersonCards(result['users'])
            getVideoCards(result['videos'])
        }
    })
}
function getPersonCards(cardList) {
    $('.person-list').empty()
    for(var i=0; i<cardList.length; i++) {
        var card = $('<div>', {
            class: 'person-card',
            click: function(e) {
                if(e.target.className == 'person-card') {
                    var person_id = $(this).children().first().text()
                    //console.log(video_id)
                    window.location.href = 'profile?u='+person_id
                }
                else if(e.target.className == 'far fa-comment-dots') {

                }
                else if(e.target.className == 'fas fa-user-plus') {
                    var uid = $(this).children().first().text()
                    sendFriendRequest(username, uid)
                }
            }
        })
        var id = $('<div>', {class: 'person-id', text: cardList[i]['username']})
        var preview = $('<div>', {class: 'person-url'})
        var img = $('<img>').prop('src', cardList[i]['url'])
        preview.append(img)
        var name = $('<div>', {class: 'person-name', text: cardList[i]['name']})
        var act = $('<div>', {class: 'person-act'})
        if( friendList.indexOf(cardList[i]['username']) > -1 ) {
            //console.log('isFriend')
            var icon = $('<i>', {class: 'far fa-comment-dots'})
        }
        else {
            //console.log('notFriend')
            var icon = $('<i>', {class: 'fas fa-user-plus'})
        }
        act.append(icon)
        card.append(id)
        card.append(preview)
        card.append(name)
        card.append(act)
        $('.person-list').append(card)
    }
}
function getVideoCards(cardList) {
    //console.log(cardList)
    $('.video-list').empty()
    for(var i=0; i<cardList.length; i++) {
        var card = $('<div>', {
            class: 'video-card',
            click: function(e) {
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
    /*<div class="video-card">
        <div class="video-id" style="display: none;">12345.mp4</div>
        <div class="card-preview"><img></div>
        <div class="video-title">12345</div>
    </div>*/
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
$(window).resize(resize)
$(document).scroll(function() {
    //console.log(ptop)
    if($(window).scrollTop()+60 >= ptop) {
        $('.pagination').css({'position': 'fixed', 'top': '60px', 'left': pleft})
    }
    else {
        $('.pagination').css({'position': ''})
    }
})
function sendFriendRequest(from, to) {
    console.log('from: '+from+' to: '+to)
}
function goLightMode() {

}
function goDarkMode() {
    
}
$('.p-all').click(function() {
    //console.log('fsdojo')
    page = 1
    $('.tablayout').css('-webkit-transform', '')
    $('.tab-line').animate({'margin-left': '0'})
    $(this).addClass('p-selected')
    $(this).siblings().removeClass('p-selected')
})
$('.p-video').click(function() {
    page = 2
    $('.tablayout').css('-webkit-transform', 'translate(-25%, 0)')
    $('.tab-line').animate({'margin-left': '90px'})
    $(this).addClass('p-selected')
    $(this).siblings().removeClass('p-selected')
})
$('.p-person').click(function() {
    page = 3
    $('.tablayout').css('-webkit-transform', 'translate(-50%, 0)')
    $('.tab-line').animate({'margin-left': '180px'})
    $(this).addClass('p-selected')
    $(this).siblings().removeClass('p-selected')
})