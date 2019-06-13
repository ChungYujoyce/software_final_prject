<?php
    $username = $_POST['username'];
    $token = $_POST['token'];
    $result = Database::get()->execute('SELECT * FROM users WHERE username = ? AND resetToken = ?', array($username, $token));
    if(count($result)!=0) {
        echo 'success';
    }
    else {
        echo 'fail';
    }