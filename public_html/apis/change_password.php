<?php
    //print_r($_POST);
    $result = Database::get()->execute('SELECT * FROM users WHERE username = ? AND password = ?', array($_POST['username'], $_POST['current']));
    //print_r($result);
    if(count($result)!=0) {
        $data_array = array(
            'password' => $_POST['newp']
        );
        Database::get()->update('users', $data_array,'username', $_POST['username']);
        echo 'success';
    }
    else {
        echo 'fail';
    }