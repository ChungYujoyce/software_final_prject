<?php
    if(isset($_POST['regist-submit'])) {
        //check duplicate
        //print_r($_POST);
        $result = Database::get()->execute('SELECT * FROM users WHERE username = ? AND password!=?', array($_POST['username'], 'fb_login'));
        $result2 = Database::get()->execute('SELECT * FROM users WHERE username = ? AND password!=?', array($_POST['username'], 'google_login'));
        //print_r($result);
        //no duplicate
        if(count($result)==0 && count($result2)==0 && $_POST['username']!='visitor') {
            if($_POST['password']==$_POST['passwordConfirm']) {
                $data_array = array(
                    'username' => $_POST['username'],
                    'password' => $_POST['password'],
                    'name' => $_POST['name'],
                    'email' => $_POST['email'],
                    'friends' => json_encode(array()),
                    'like_list' => json_encode(array()),
                    'view_list' => json_encode(array()),
                    'subscribe_list' => json_encode(array()),
                );
                Database::get()->insert('users', $data_array);
                $_SESSION['username'] = $_POST['username'];
                header('Location: main');
                exit;
            }
            else {
                header('Location: register');
                exit;
            }
        }
        else {
            //username has used
            $_SESSION['duplicate'] = '使用者名稱已被使用！';
            header('Location: register');
            exit;
        }
    }