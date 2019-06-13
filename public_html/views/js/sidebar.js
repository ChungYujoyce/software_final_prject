$('.act-home').click(function () { // user action detect and corresponding reaction
    window.location.href = '/'
})
$('.act-subscribe').click(function () {
    window.location.href = 'subscribe'
})
$('.act-like').click(function () {
    window.location.href = 'like'
})
$('.act-message').click(function () {
    window.location.href = 'messages'
})
$('.act-profile').click(function () {
    window.location.href = 'profile?u=' + username
})
$('.act-upload').click(function () {
    window.location.href = 'upload'
})
$('.please-login').click(function () {
    window.location.href = 'login'
})
function getFriendList() { // if adding a user as your friend
    var data = new FormData()
    data.append('key', '')
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
            //console.log(searchList)
            $('.friend-list').empty()
            for (var i = 0; i < searchList.length; i++) { // adding to list
                var friend = $('<div>', {
                    class: 'afriend',
                    click: function () {
                        var id = $(this).children().first().text()
                        location.href = 'messages?uid=' + id
                    }
                })
                // your friend info appending
                var id = $('<div>', { class: 'friend-id', text: searchList[i]['username'] })
                var icon = $('<div>', { class: 'friend-icon' })
                var img = $('<img>').prop('src', searchList[i]['url'])
                icon.append(img)
                var name = $('<div>', { class: 'friend-name', text: searchList[i]['name'] })
                friend.append(id)
                friend.append(icon)
                friend.append(name)
                $('.friend-list').append(friend)
            }
        }
    })
}