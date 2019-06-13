var username = ''
$(document).ready(function() {
    //resize()
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
        getMyVideo()
        isFBorGO()
        getEditInfo()
    }
})
function isFBorGO() {
    var data = new FormData()
    data.append('username', username)
    //console.log(video_id)
    $.ajax({
        type: 'post',
        url: 'apis/login_state',
        data: data,
        processData: false,
        contentType: false,
        success: function(response) {
            //console.log(response)
            if(response=='google_login') {
                $('.gf-title').text('您已使用Google帳號登入囉')
                $('.icon').html('<i class="fab fa-google"></i>')
                $('.go-or-fb').css('display', 'block')
            }
            else if(response=='fb_login') {
                $('.gf-title').text('您已使用Facebook帳號登入囉')
                $('.icon').html('<i class="fab fa-facebook"></i>')
                $('.icon').css('color', '#3b5998')
                $('.go-or-fb').css('display', 'block')
            }
            else {
                $('.normal').css('display', 'block')
            }
        }
    })
}
$('.p-photo').click(function() {
    var f = document.createElement('input')
    f.type = 'file'
    f.accept = 'image/*'
    f.addEventListener('change', function(){
        var file = $(this)[0].files[0]
        console.log(file)
        var data = new FormData()
        data.append('username', username)
        data.append('photo', file)
        $.ajax({
            type: 'post',
            url: 'apis/update_user_photo',
            data: data,
            processData: false,
            contentType: false,
            success: function(response) {
                console.log(response)
                getEditInfo()
                getUserNavInfo()
                $(this).remove()
            }
        })
    })
    f.click()
})
var edittype = ''
$('.p-name').click(function() {
    $('.normal').css('transform', 'translateX(-120%)')
    $('.normal-edit').css('transform', 'translateX(-100%)')
    $('.edit-title').text('輸入新名稱')
    $('.edit-box').prop('placeholder', '您的名稱')
    $('.edit-box').val($('.pp-name').text())
    $('.edit-box-confirm').css('visibility', 'hidden')
    edittype = 'name'
})
$('.p-email').click(function() {
    $('.normal').css('transform', 'translateX(-120%)')
    $('.normal-edit').css('transform', 'translateX(-100%)')
    $('.edit-title').text('輸入新電子信箱')
    $('.edit-box').prop('placeholder', '您的電子信箱')
    $('.edit-box').val($('.pp-email').text())
    $('.edit-box-confirm').css('visibility', 'hidden')
    edittype = 'email'
})
$('.p-pwd').click(function() {
    $('.normal').css('transform', 'translateX(-120%)')
    $('.normal-edit').css('transform', 'translateX(-100%)')
    $('.edit-title').text('更新您的密碼')
    $('.edit-box').prop('placeholder', '您的舊密碼')
    $('.p').prop('placeholder', '您的新密碼')
    $('.pc').prop('placeholder', '確認新密碼')
    $('.edit-box').val('')
    $('.edit-box').prop('type', 'password')
    edittype = 'password'
})
$('.cancel').click(function() {
    $('.normal').css('transform', '')
    $('.normal-edit').css('transform', '')
    $('.edit-box').prop('type', 'text')
    $('.edit-box-confirm').css('visibility', 'visible')
})
$('.enter').click(function() {
    if(edittype=='password') {
        if($('.p').val()==$('.pc').val()) {
            var val = $('.edit-box').val()
            var data = new FormData()
            data.append('username', username)
            data.append('current', val)
            data.append('newp', $('.p').val())
            $.ajax({
                type: 'post',
                url: 'apis/change_password',
                processData: false,
                contentType: false,
                data: data,
                success: function(response) {
                    console.log(response)
                    getEditInfo()
                    getUserNavInfo()
                    $('.normal').css('transform', '')
                    $('.normal-edit').css('transform', '')
                    $('.edit-box').prop('type', 'text')
                }
            })
        }
        else {
            alert('密碼不相符')
        }
    }
    else {
        var val = $('.edit-box').val()
        var data = new FormData()
        data.append('username', username)
        data.append(edittype, val)
        $.ajax({
            type: 'post',
            url: 'apis/update_user_info',
            processData: false,
            contentType: false,
            data: data,
            success: function(response) {
                console.log(response)
                getEditInfo()
                getUserNavInfo()
                $('.normal').css('transform', '')
                $('.normal-edit').css('transform', '')
                $('.edit-box-confirm').css('height', 'auto')
            }
        })
    }
})
function getEditInfo() {
    var data = new FormData()
    data.append('username', username)
    data.append('col', 'name, email')
    $.ajax({
        type: 'post',
        url: 'apis/get_user_info',
        processData: false,
        contentType: false,
        data: data,
        dataType: 'json',
        success: function (response) {
            //console.log(response[0])
            console.log(response[0])
            $('.pp-name').text(response[0]['name'])
            $('.pp-email').text(response[0]['email'])
        },
        error: function() {

        }
    })
}
function getMyVideo() {
    var data = new FormData()
    data.append('uid', username)
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
                var video = $('<div>', {class: 'avideo'})
                var view = $('<div>', {class: 'view'})
                var preview = $('<div>', {class: 'vpreview'})
                var img = $('<img>').prop('src', 'videos/snapshots/'+cardList[i]['video_id']+'.png')
                preview.append(img)
                var title = $('<input>', {class: 'vtitle', placeholder: '影片名稱'}).val(cardList[i]['name'])
                title.prop('readonly', true)
                var more = $('<div>', {
                    class: 'vmore small',
                    click: function() {
                        if($(this).hasClass('small')) {
                            $(this).parent().addClass('big-view')
                            $(this).parent().parent().addClass('big-avideo')
                            $(this).siblings().first().addClass('big-preview')
                            $(this).siblings().eq(1).addClass('big-title')
                            $(this).siblings().eq(1).prop('readonly', false)
                            $(this).siblings().eq(2).addClass('big-content')
                            $(this).siblings().eq(3).addClass('big-vsave')
                            $(this).removeClass('small')
                            $(this).addClass('big')
                            $(this).html('<i class="fas fa-chevron-up"></i>')
                        }
                        else if($(this).hasClass('big')) {
                            $(this).parent().removeClass('big-view')
                            $(this).parent().parent().removeClass('big-avideo')
                            $(this).siblings().first().removeClass('big-preview')
                            $(this).siblings().eq(1).removeClass('big-title')
                            $(this).siblings().eq(1).prop('readonly', true)
                            $(this).siblings().eq(2).removeClass('big-content')
                            $(this).siblings().eq(3).removeClass('big-vsave')
                            $(this).removeClass('big')
                            $(this).addClass('small')
                            $(this).html('<i class="fas fa-chevron-down"></i>')
                        }
                    }
                })
                var ic = $('<i>', {class: 'fas fa-chevron-down'})
                more.append(ic)
                var ta = $('<textarea>', {class: 'vcontent', placeholder: '影片簡介'}).val(cardList[i]['description'])
                var id = $('<div>', {class:'video-id', text: cardList[i]['video_id']})
                var save = $('<button>', {
                    class: 'vsave',
                    click: function() {
                        var id = $(this).siblings().eq(4).text()
                        var name = $(this).siblings().eq(1).val()
                        var content = $(this).siblings().eq(3).val()
                        var data = new FormData()
                        data.append('username', username)
                        data.append('video_id', id)
                        data.append('name', name)
                        data.append('content', content)
                        $.ajax({
                            type: 'post',
                            url: 'apis/update_video_content',
                            processData: false,
                            contentType: false,
                            data: data,
                            success: function(response) {
                                console.log(response)
                            }
                        })
                    },
                    text: '儲存'})
                var info = $('<div>', {class: 'vinfo'})
                var ic2 = $('<i>', {class: 'fas fa-ellipsis-v'})
                info.append(ic2)
                view.append(preview)
                view.append(title)
                view.append(more)
                view.append(ta)
                view.append(save)
                view.append(id)
                view.append(info)
                video.append(view)
                $('.video-list').append(video)
            }
            /**
             * 
                <div class="avideo">
                    <div class="view">
                        <div class="vpreview"></div>
                        <input class="vtitle" value="那些你很冒險的夢" placeholder="影片名稱" readonly>
                        <div class="vmore small"><i class="fas fa-chevron-down"></i></div>
                        <textarea class="vcontent">aoisdjoijaisodfjosjdaofjdsoijafoijdsoiafjoisdjfoisdjoiafjsoaidjfoiajdsfoi
                            fadsjfoisjdaoifjodisajfoidsjaoifj
                        </textarea>
                        <button class="vsave">儲存</button>
                    </div>
                </div>
             */
        }
    })
}
$('.isave').click(function() {
    var intro = $('.intro').val()
    var data = new FormData()
    data.append('username', username)
    data.append('intro', intro)
    $.ajax({
        type: 'post',
        url: 'apis/update_user_info',
        processData: false,
        contentType: false,
        data: data,
        success: function(response) {
            console.log(response)
        }
    })
})
function goLightMode() {
    
}
function goDarkMode() {
    
}