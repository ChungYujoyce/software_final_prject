<?php // get user info , if all right , enter the page
    if(isset($_POST['username'])) {
        if(isset($_POST['name'])) {
            $data_array = array(
                'name' => $_POST['name']
            );
            Database::get()->update('users', $data_array,'username', $_POST['username']);
        }
        if(isset($_POST['email'])) {
            $data_array = array(
                'email' => $_POST['email']
            );
            Database::get()->update('users', $data_array,'username', $_POST['username']);
        }
        if(isset($_POST['intro'])) {
            $data_array = array(
                'intro' => $_POST['intro']
            );
            Database::get()->update('users', $data_array,'username', $_POST['username']);
        }
        echo 'success';
    }
    else {
        echo 'fail';
    }