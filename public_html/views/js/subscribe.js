var username = 'visitor'
var cardList = []
$(document).ready(function () { // function activate
    username = $('.session').text()
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
    getVideoCards()
})
function getVideoCards() { // video info and cards display
    var data = new FormData()
    data.append('username', username)
    $.ajax({
        type: 'post',
        url: 'apis/get_video',
        processData: false,
        contentType: false,
        data: data,
        dataType: 'json',
        success: async function (response) { // data get
            console.log(response)
            cardList = response
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
                var id = $('<div>', { class: 'video-id', text: cardList[i]['video_id'] }) // cards creation
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
        }
    })
    /*<div class="video-card">
        <div class="video-id" style="display: none;">12345.mp4</div>
        <div class="card-preview"><img></div>
        <div class="video-title">12345</div>
    </div>*/
}
function goLightMode() {

}
function goDarkMode() {

}