<?php
    //print_r($_POST);
    $data_array = array($_POST['username'], $_POST['password']);
    $result = Database::get()->execute('SELECT * FROM users WHERE username = ? AND password = ?', $data_array);
    //print_r($result);
    if(count($result)!=0) {
        $_SESSION['username'] = $_POST['username'];
        header('Location: main');
        exit;
    }
    else {
        $_SESSION['wrong'] = '帳號或密碼有誤！';
        header('Location: login');
        exit;
    }