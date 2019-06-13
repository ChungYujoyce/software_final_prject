<?php
    $client = new Google_Client();  // Specify the CLIENT_ID of the app that accesses the backend
    $payload = $client->verifyIdToken($_POST['idtoken']);
    if ($payload) {
        $userid = $payload['sub'];
        $email = $payload['email'];
        $picture = $payload['picture'];
        $name = $payload['name'];
        // If request specified a G Suite domain:
        //$domain = $payload['hd'];
        $result = Database::get()->execute('SELECT * FROM users WHERE username = ? AND password = ?', array($userid, 'google_login'));
        if(count($result) == 0) {
            $data_array = array(
                'username' => $userid,
                'password' => 'google_login',
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
        $_SESSION['username'] = $userid;
        echo 'success';
    } else {
        // Invalid ID token
        echo 'fail';
    }