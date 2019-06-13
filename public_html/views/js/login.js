fbInit()
googleInit()
function fblogin() { // login by facebook
    FB.login(function (response) {
        var id_token = response['authResponse']['accessToken']
        //console.log(token)
        /*var xhr = new XMLHttpRequest()
        xhr.open('POST', 'fb_callback')
        //xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
        xhr.onload = function() {
            console.log(xhr.responseText)
        };
        xhr.send('idtoken=' + id_token)*/
        $.ajax({
            type: 'post',
            url: 'fb_callback',
            data: { 'idtoken': id_token },
            success: function (response) {
                console.log(response)
                if (response == 'success') {
                    window.location.href = '/'
                }
            }
        })
    }, { scope: 'public_profile,email' })
}
function onSignIn(googleUser) { // login in by creating the account

    // The ID token you need to pass to your backend:
    var id_token = googleUser.getAuthResponse().id_token
    //console.log("ID Token: " + id_token)
    var xhr = new XMLHttpRequest()
    xhr.open('POST', 'google_callback')
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    xhr.onload = function () {
        console.log(xhr.responseText)
        if (xhr.responseText == 'success') {
            window.location.href = '/'
        }
    };
    xhr.send('idtoken=' + id_token)
}
function onFailure(error) {
    console.log(error)
}
function googleInit() { // login in by google account
    gapi.load('auth2', function () {
        // Retrieve the singleton for the GoogleAuth library and set up the client.
        auth2 = gapi.auth2.init({
            client_id: '512095629862-9bkq5vl9jsahn2pgks06nd5hos4v75fb.apps.googleusercontent.com',
            cookiepolicy: 'single_host_origin',
            // Request scopes in addition to 'profile' and 'email'
            //scope: 'additional_scope'
        })
        attachSignin($('.google-btn').get(0))
    })
}
function attachSignin(element) {
    //console.log(element)
    auth2.attachClickHandler(element, {}, onSignIn, onFailure)
}
function fbInit() { // connect to facebook information
    window.fbAsyncInit = function () {
        FB.init({
            appId: '452098582211614',
            cookie: true,
            xfbml: true,
            version: 'v3.3'
        });

        FB.AppEvents.logPageView();
        checkLoginState()

    };

    (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) { return; }
        js = d.createElement(s); js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
}
//check
function checkLoginState() {
    FB.getLoginStatus(function (response) {
        //statusChangeCallback(response);
    });
}
$('.fb-btn').click(fblogin)