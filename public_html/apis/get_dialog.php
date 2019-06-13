<?php // get dialog from user and friend
    if(isset($_POST['username']) && isset($_POST['friend'])) {
        //print_r($_POST);
        $fromuser = Database::get()->execute('SELECT * FROM messages WHERE _from=? AND _to=?', array($_POST['username'], $_POST['friend']));
        $fromfriend = Database::get()->execute('SELECT * FROM messages WHERE _from=? AND _to=?', array($_POST['friend'], $_POST['username']));
        $dialog = new stdClass();
        if(!isset($fromuser))
            $fromuser = array();
        if(!isset($fromfriend))
            $fromfriend = array();
        $dialog->fromuser = $fromuser;
        $dialog->fromfriend = $fromfriend;
        print_r(json_encode($dialog));
    }