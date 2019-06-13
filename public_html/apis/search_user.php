<?php
    if(isset($_POST['key'])) {
        $result = Database::get()->execute('SELECT username, name FROM users WHERE name LIKE ?', array($_POST['key'].'%'));
        print_r(json_encode($result));
    }