var username = ''
var filename = ''
var ext = ''
var file
var video
var video_id = ''
var desc = ''
var dataURL = ''
var isUploaded = false
var loading = false
$(document).ready(function () { // upload state detection
    username = $('.session').text()
    if (username == 'visitor') {
        $('.notlogin').fadeIn()
    }
    else {
        getUserNavInfo()
        $('.islogin').fadeIn()
        getNotification()
        getNoteMessage()
    }
    document.title = '上傳 - Videoh'
})
$('.upload-btn i').click(function () { // button detection
    var f = document.createElement('input')
    f.type = 'file'
    f.className = 'upload-video'
    f.accept = 'video/mp4'
    f.addEventListener('change', function () {
        file = $(this)[0].files[0]
        uploadVideo()
    })
    f.click()
})
$('.drag-file').on(
    'dragover',
    function (e) {
        e.preventDefault()
        e.stopPropagation()
    }
)
$('.drag-file').on(
    'dragenter',
    function (e) {
        e.preventDefault()
        e.stopPropagation()
        $('.dotted').css('transform', 'scale(0.95)')
    }
)
$(document).on(
    'dragenter',
    function (e) {
        if (e.target.className != 'drag-file') {
            $('.dotted').css('transform', '')
        }
    }
)
$('.drag-file').on( // dragging file and test if it's the right type
    'drop', 
    function (e) {
        if (e.originalEvent.dataTransfer) {
            if (e.originalEvent.dataTransfer.files.length) {
                e.preventDefault()
                e.stopPropagation()
                /*UPLOAD FILES HERE*/
                file = e.originalEvent.dataTransfer.files[0]
                if (file['type'] == 'video/mp4') {
                    //console.log('video!!')
                    uploadVideo()
                }
                else {
                    alert('請選擇mp4格式檔案!!')
                    //console.log('not video!!')
                }
            }
        }
    }
)
$(document).mousemove(function (e) { // change the cover page of video
    if (isDragTime) {
        var width = e.pageX - $('.video').offset().left
        lpercent = width / $('.video').width()
        if (lpercent < 0)
            lpercent = 0
        else if (lpercent >= 1)
            lpercent = 0.999999
        //console.log(begin)
        video.currentTime = lpercent * video.duration
        $('.time-handle').css('left', 100 * lpercent + '%')
    }
})
$(document).mouseup(function () { // mouseup detect and image selection
    if (isDragTime) {
        isDragTime = false
    }
})
$('input[type="checkbox"]').on('change', function () { // add some description about the video
    $(this).prop('checked', true)
    $('input[type="checkbox"]').not(this).prop('checked', false)
    if ($(this).hasClass('use')) {
        getSnapShot()
        $('.time-handle').css('display', 'block')
    }
    else { // either words(typing) or images(by uploading or dragging)
        $('.time-handle').css('display', 'none')
        var f = document.createElement('input')
        f.type = 'file'
        f.accept = 'image/*'
        f.addEventListener('change', function () {
            file = $(this)[0].files[0]
            console.log(file)
            var img = new Image()
            img.onload = function () {
                var canvas = document.createElement('canvas')
                canvas.width = 640
                canvas.height = 480
                var ctx = canvas.getContext('2d')
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
                dataURL = canvas.toDataURL('image/png')
                $('.preview-img').attr('src', dataURL)
            }
            img.src = URL.createObjectURL(file)
        })
        f.click()
    }
})
var isDragTime = false
$('.time-handle').mousedown(function () {
    isDragTime = true
})
$('.basic').click(function () {
    $('.whole-page').css('-webkit-transform', '')
    $('.basic-border').css({ 'margin-left': '10px' })
    $('.time-handle').css('display', 'none')
})
$('.chs-pic').click(function () {
    $('.whole-page').css('-webkit-transform', 'translate(-22vw, 0)')
    $('.basic-border').css({ 'margin-left': '110px' })
    $('.time-handle').css('display', 'block')
})
$('.release').click(function () { // sending videos
    if (isUploaded) {
        var data = new FormData()
        data.append('username', username)
        data.append('video_id', video_id)
        data.append('name', $('.video-name').val())
        data.append('desc', $('.video-desc').val())
        data.append('imageData', dataURL)
        $.ajax({ // info to database
            type: 'post',
            url: 'apis/release_video',
            data: data,
            processData: false,
            contentType: false,
            success: function (response) {
                console.log(response)
                $('.upload-edit').css('display', 'none')
                $('.go-back').fadeIn()
            }
        })
    }
})
$('.go-home').click(function () {
    location.href = '/'
})
function getSnapShot() { // the image cover of video shown on home page
    console.log('hihi')
    var canvas = document.createElement('canvas')
    canvas.width = 640
    canvas.height = 480
    var ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    //convert to desired file format
    dataURL = canvas.toDataURL('image/png')
    $('.preview-img').attr('src', dataURL)
    $('.status').text('上傳狀態: 已準備好被上傳！')
    isUploaded = true
    $('.release').css({
        'cursor': 'pointer',
        'background': '#1e90ff'
    })
}
function uploadVideo() { // video info setting done , ready to upload
    $('.drag-file').css('display', 'none')
    $('.content').css('width', '51vw')
    $('.upload-edit').fadeIn()
    filename = file['name'].split('.').slice(0, -1).join('.')
    ext = file['name'].split('.').pop()
    console.log(file)
    $('.video-name').val(filename)
    var data = new FormData()
    data.append('username', username)
    data.append('video', file)
    $.ajax({ // show the progress of uploading
        xhr: function () {
            var xhr = new XMLHttpRequest()
            loading = true
            xhr.upload.addEventListener('progress', function (evt) {
                if (evt.lengthComputable) {
                    var percentComplete = evt.loaded / evt.total
                    $('.value').css('width', 100 * percentComplete + '%')
                    $('.handle').text(Math.floor(100 * percentComplete) + '%')
                }
            }, false)
            return xhr
        },
        type: 'post',
        url: 'apis/upload_video',
        data: data,
        processData: false,
        contentType: false,
        success: function (response) { //successfully upload
            console.log(response)
            video_id = response
            video = document.createElement('video')
            video.src = 'videos/' + video_id + '.' + ext
            $('.status').text('上傳狀態: 獲取預覽圖片中')
            video.addEventListener('canplay', function () {
                //console.log(video.duration)
                console.log('onload')
                getSnapShot()
            })
            $(this).remove()
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $.ajax(this)
            return
        }
    })
}
function goLightMode() {

}
function goDarkMode() {

}