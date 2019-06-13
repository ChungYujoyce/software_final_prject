<?php
    //print_r($_POST);
    if(isset($_POST['username'])) { // print all reply
        $result = Database::get()->execute('SELECT reply FROM messages WHERE id = ?', array($_POST['id']));
        print_r(json_encode($result[0]['reply']));
    }