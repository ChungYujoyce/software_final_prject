<?php
    if(isset($_POST['username'])) {
        $result = Database::get()->execute('SELECT password FROM users WHERE username=?', array($_POST['username']));
        $pwd = $result[0]['password'];
        if($pwd=='google_login' || $pwd=='fb_login') {
            echo $pwd;
        }
        else 
            echo 'normal_login';
    }