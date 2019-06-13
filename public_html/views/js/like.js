var username = 'visitor' // user without entering the account
$(document).ready(function () {
    username = $('.session').text()
    //console.log(username)
    if (username == 'visitor') {
        $('.notlogin').fadeIn()
    }
    else {
        getUserNavInfo()
        getLikeVideo()
        $('.islogin').fadeIn()
        getFriendList()
        getNotification()
        getNoteMessage()
    }
})
$('.main-preview').click(function () {
    var video_id = $('.like-list').children().first().children().first().text()
    window.location.href = 'watch?v=' + video_id + '&playList=' + username + '&index=1'
})
function getLikeVideo() { // detect like 
    var data = new FormData()
    data.append('username', username)
    $.ajax({
        type: 'post',
        url: 'apis/get_like_list',
        data: data,
        processData: false,
        contentType: false,
        dataType: 'json',
        success: async function (response) { //send to like-video list
            var otherVideo = response
            $('.preview img').prop('src', 'videos/snapshots/' + otherVideo[0]['video_id'] + '.png')
            $('.like-list').empty()
            $('.video-cnt').text(otherVideo.length+'部影片')
            for (var i = 0; i < otherVideo.length; i++) {
                var card = $('<div>', {
                    class: 'video-card',
                    click: function () {
                        var video_id = $(this).children().first().text()
                        var index = $(this).children().eq(1).text()
                        //console.log(video_id)
                        window.location.href = 'watch?v=' + video_id + '&playList=' + username + '&index=' + index
                    }
                })
                var uname = ''
                var data = new FormData()
                data.append('username', otherVideo[i]['upload_user']) // liked-video info
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
                // add liked videoes to user's own page
                var id = $('<div>', { class: 'video-id', text: otherVideo[i]['video_id'] })
                var index = $('<div>', { class: 'id', text: i + 1 })
                var pic = $('<div>', { class: 'card-preview' })
                var img = $('<img>').prop('src', 'videos/snapshots/' + otherVideo[i]['video_id'] + '.png')
                pic.append(img)
                var txt = $('<div>', { class: 'card-txt' })
                var name = $('<div>', { class: 'card-name', text: otherVideo[i]['name'] })
                var owner = $('<div>', { class: 'card-owner', text: uname })
                txt.append(name)
                txt.append(owner)
                card.append(id)
                card.append(index)
                card.append(pic)
                card.append(txt)
                $('.like-list').append(card)
            }
        }
    })
}
function goLightMode() {

}
function goDarkMode() {

}