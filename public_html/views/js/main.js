var middle = 2
var width = 0
var cardList = []
var items = []
var friendList = []
var username = ''
var length = 0
var distance = 2
$(document).ready(function () { // function activate
    //resize()
    getVideoCards()
    username = $('.session').text()
    width = $('.carousel').width()
    //console.log(username)
    if (username == 'visitor') {
        $('.notlogin').fadeIn()
    }
    else {
        getUserNavInfo()
        $('.islogin').fadeIn()
        getFriendList()
        getNotification()
        getNoteMessage()
    }
})
async function initList(videos) { // show all uploaded videos
    length = videos.length
    $('.carousel').empty()
    for (var i = 0; i < 5; i++) {
        var item = $('<div>', {
            class: 'carousel-item',
            click: function () {
                var video_id = $(this).children().first().text()
                //console.log(video_id)
                window.location.href = 'watch?v=' + video_id
            }
        })
        var uname = ''
        var uurl = ''
        var data = new FormData()
        data.append('username', videos[i]['upload_user'])
        data.append('col', 'name, url')
        await $.ajax({
            type: 'post',
            url: 'apis/get_user_info',
            processData: false,
            contentType: false,
            dataType: 'json',
            data: data,
            success: function (response) {
                uname = response[0]['name']
                uurl = response[0]['url']
            }
        })
        var id = $('<div>', { class: 'video-id', text: videos[i]['video_id'] })
        var preview = $('<div>', { class: 'preview' })
        var img = $('<img>').prop('src', 'videos/snapshots/' + videos[i]['video_id'] + '.png')
        preview.append(img)
        var vinfo = $('<div>', { class: 'video-info' })
        var uinfo = $('<div>', { class: 'user-info' })
        var userImg = $('<div>', { class: 'user-image' })
        var uimg = $('<img>').prop('src', uurl)
        userImg.append(uimg)
        var uploadUser = $('<div>', { class: 'user-name', text: uname })
        uinfo.append(userImg)
        uinfo.append(uploadUser)
        var title = $('<div>', { class: 'title', text: videos[i]['name'] })
        var desc = $('<div>', { class: 'video-detail', text: videos[i]['description'] })
        vinfo.append(uinfo)
        vinfo.append(title)
        vinfo.append(desc)
        item.append(id)
        item.append(preview)
        item.append(vinfo)
        items.push(item)
        $('.carousel').append(item)
    }
    resize()
}
function putInList() { // 
    for (var i = 0; i < items.length; i++) {
        var d = Math.abs(i - middle)
        if (d != 0) {
            var iwidth = $('.carousel-item').width()
            var scale = (iwidth - d * 100) / iwidth
            //console.log(scale)
            var left = i > middle ? width / 2 - 250 * (1 - Math.pow(1.3, d)) / 0.5 : width / 2 + 250 * (1 - Math.pow(1.3, d)) / 0.5
            left = i > middle ? width / 2 + (iwidth / 2 + d * 80) - (iwidth - d * 100) / 2 : width / 2 - (iwidth / 2 + d * 80) + (iwidth - d * 100) / 2
            items[i].css({
                '-webkit-transform': 'translate(-50%, -50%) scale(' + scale + ')',
                'left': left + 'px',
                'z-index': '999' - d,
                'display': 'block',
            })
        }
        else {
            //console.log('middle: '+i)
            items[i].css({
                '-webkit-transform': '',
                'z-index': '999',
                'left': '50%',
                'display': 'block',
            })
        }
        if (d > distance) {
            items[i].css({
                'display': 'none'
            })
        }
    }
}
$('.next i').on('click', function () {
    if (middle != items.length - 1)
        middle++
    putInList()
})
$('.prev i').on('click', function () {
    if (middle != 0)
        middle--
    putInList()
})
$(window).resize(resize)
$(window).keydown(function (e) {
    //console.log(e.keyCode)
    //e.preventDefault()
    if (!$('.search-txt').is(':focus')) {
        switch (e.keyCode) {
            case 37:
                updateMiddle(1)
                break
            case 39:
                updateMiddle(0)
                break
        }
    }
})
function resize() {
    width = $('.carousel').width()
    var dwidth = $(document).width()
    //console.log(dwidth)
    if (dwidth > 1700) {
        distance = 2
    }
    else if (dwidth <= 1700 && dwidth > 1520) {
        distance = 1
    }
    else if (dwidth <= 1520 && dwidth > 1350) {
        distance = 0
    }
    else if (dwidth <= 1350 && dwidth > 800) {
        distance = 0
    }
    else {
        distance = 0
    }
    putInList(cardList)
}
function updateMiddle(dir) {
    if (dir == 0 && middle != items.length - 1)
        middle++
    else if (dir == 1 && middle != 0)
        middle--
    putInList()
}
function getVideoCards() { // get data from database and show on main page
    $.ajax({
        type: 'post',
        url: 'apis/get_video',
        processData: false,
        contentType: false,
        dataType: 'json',
        success: async function (response) {
            cardList = response
            await initList(randomSort(cardList))
            $('.video-list').empty()
            for (var i = 0; i < cardList.length; i++) {
                var uname = ''
                var data = new FormData()
                data.append('username', cardList[i]['upload_user'])
                data.append('col', 'name')
                await $.ajax({
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
                var card = $('<div>', {
                    class: 'video-card',
                    click: function () {
                        var video_id = $(this).children().first().text()
                        //console.log(video_id)
                        window.location.href = 'watch?v=' + video_id
                    }
                })
                var id = $('<div>', { class: 'video-id', text: cardList[i]['video_id'] })
                var preview = $('<div>', { class: 'card-preview' })
                var img = $('<img>').prop('src', 'videos/snapshots/' + cardList[i]['video_id'] + '.png')
                preview.append(img)
                var title = $('<div>', { class: 'video-title', text: cardList[i]['name'] })
                var name = $('<div>', { class: 'upload-user', text: uname })
                var count = $('<div>', { class: 'view-count', text: '觀看次數: ' + cardList[i]['view_count'] + '次' })
                card.append(id)
                card.append(preview)
                card.append(title)
                card.append(name)
                card.append(count)
                $('.video-list').append(card)
            }
            if ($('.dark-mode').text() == 'yes') {
                darkMode = true
                goDarkMode()
            }
            else {
                darkMode = false
                goLightMode()
            }
        }
    })
    /*<div class="video-card">
        <div class="video-id" style="display: none;">12345.mp4</div>
        <div class="card-preview"><img></div>
        <div class="video-title">12345</div>
    </div>*/
}
function goDarkMode() { // cahnge color-mode setting
    $('body').css({
        'color': 'white',
        'background': '#121212'
    })
    $('.carousel-item').css('background', '#1e272e')
    $('.video-card').css('background', '#1e272e')
    $('.sidebar').css('background', '#1e272e')
    $('.sidebar').css('color', 'wheat')
}
function goLightMode() {
    $('body').css({
        'color': 'black',
        'background': 'white'
    })
    $('.carousel-item').css('background', 'white')
    $('.video-card').css('background', 'white')
    $('.sidebar').css('background', '#f5db8d')
    $('.sidebar').css('color', '#5f5a43')
}
function randomSort(array) { // randomly pick a video (for showing on top)
    var list = array.slice(0, array.length)
    var currentIndex = list.length, temporaryValue, randomIndex

    while (0 !== currentIndex) {

        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex -= 1;

        temporaryValue = list[currentIndex]
        list[currentIndex] = list[randomIndex]
        list[randomIndex] = temporaryValue
    }

    return list
}