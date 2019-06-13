<?php
    if(isset($_POST['uid'])) {
        $result = Database::get()->execute('SELECT name, url, cover_url FROM users WHERE username = ?',array($_POST['uid']));
        print_r(json_encode($result));
    }
    else if(isset($_POST['username']) && isset($_POST['col'])) {
        $result = Database::get()->execute('SELECT '.$_POST['col'].' FROM users WHERE username = ?',array($_POST['username']));
        print_r(json_encode($result));
    }