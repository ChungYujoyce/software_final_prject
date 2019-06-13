<?php
    // Use one of the helper classes to get a Facebook\Authentication\AccessToken entity.
    //   $helper = $fb->getRedirectLoginHelper();
    //   $helper = $fb->getJavaScriptHelper();
    //   $helper = $fb->getCanvasHelper();
    //   $helper = $fb->getPageTabHelper();
    //print_r($_POST);
    $accessToken = $_POST['idtoken'];
    //echo $accessToken;
    try {
        // Get the \Facebook\GraphNodes\GraphUser object for the current user.
        // If you provided a 'default_access_token', the '{access-token}' is optional.
        //$response = $fb->get('/me', $accessToken);
        //var_dump($response);
        $oAuth2Client = $fb->getOAuth2Client();
        $tokenMetadata = $oAuth2Client->debugToken($accessToken);
        //var_dump($tokenMetadata);
    } catch(\Facebook\Exceptions\FacebookResponseException $e) {
        // When Graph returns an error
        echo 'Graph returned an error: ' . $e->getMessage();
        exit;
    } catch(\Facebook\Exceptions\FacebookSDKException $e) {
        // When validation fails or other local issues
        echo 'Facebook SDK returned an error: ' . $e->getMessage();
        exit;
    }
    $fb->setDefaultAccessToken($accessToken);
    $response = $fb->get('/me?locale=en_US&fields=id,name,email,picture');
    $userNode = $response->getGraphUser();
    $email = $userNode->getField('email');
    $fb_user_id = $userNode->getField('id');
    $name = $userNode->getField('name');
    $picture = $userNode->getField('picture')['url'];
    //echo $name.'<br>'.$email.'<br>'.$picture.'<br>'.$fb_user_id;
    //
    $result = Database::get()->execute('SELECT * FROM users WHERE username = ? AND password = ?', array($fb_user_id, 'fb_login'));
    if(count($result) == 0) {
        $data_array = array(
            'username' => $fb_user_id,
            'password' => 'fb_login',
            'name' => $name,
            'email' => $email,
            'url' => $picture,
            'friends' => json_encode(array()),
            'like_list' => json_encode(array()),
            'view_list' => json_encode(array()),
            'subscribe_list' => json_encode(array()),
        );
        Database::get()->insert('users', $data_array);
    }
    $_SESSION['username'] = $fb_user_id;
    echo 'success';
    //header('Location: main');
    //exit;
    //$me = $response->getGraphUser();
    //print_r($response);
    //echo 'Logged in as ' . $me->getName();