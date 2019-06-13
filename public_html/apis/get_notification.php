<?php // show all notification "normal or messages" 
    if(isset($_POST['username'])) {
        $normal = Database::get()->execute('SELECT * FROM notifications WHERE username=? AND type=?', array($_POST['username'], 'normal'));
        $message = Database::get()->execute('SELECT * FROM notifications WHERE username=? AND type=?', array($_POST['username'], 'message'));
        $length = Database::get()->execute('SELECT * FROM notifications WHERE username=? AND type=? AND _view=?', array($_POST['username'], 'normal', 'no'));
        $result = new stdClass();
        $reverse = array_reverse($normal);
        $result->norlength = sizeof($length);
        $result->normal = $reverse;
        $result->message = $message;
        print_r(json_encode($result));
    }