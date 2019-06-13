<?php // show your friends 
    if(isset($_POST['username'])&&isset($_POST['uid'])) {
        //var_dump($_POST);
        $result = Database::get()->execute('SELECT friends FROM users WHERE username=?', array($_POST['username']));
        //print_r($result);
        $list = json_decode($result[0]['friends']);
        for($i=0; $i<sizeof($list); $i++) {
            if($list[$i]->username==$_POST['uid']) {
                echo $list[$i]->state;
                exit;
            }
        }
        echo 'not friend';
    }