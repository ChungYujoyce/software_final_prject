<?php // new data from reset password
    if(isset($_POST['username'])) {
        if($_POST['newp']==$_POST['newpc']) {
            $data_array = array(
                'password' => $_POST['newp']
            );
            Database::get()->update('users', $data_array,'username', $_POST['username']);
            echo 'success';
        }
        else {
            echo 'fail';
        }
    }
    else {
        echo 'fail';
    }