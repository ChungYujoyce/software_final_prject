<?php
    // username send request to uid
    if(isset($_POST['username']) && isset($_POST['uid'])) {
        //update friend state between two users
        $result = Database::get()->execute('SELECT friends FROM users WHERE username=?', array($_POST['username']));
        $list1 = json_decode($result[0]['friends']);
        $obj = new stdClass();
        $obj->username = $_POST['uid'];
        $obj->state = 'request';
        array_push($list1, $obj);
        $data_array = array(
            'friends' => json_encode($list1)
        );
        Database::get()->update('users', $data_array, 'username', $_POST['username']);
        $result = Database::get()->execute('SELECT friends FROM users WHERE username=?', array($_POST['uid']));
        $list2 = json_decode($result[0]['friends']);
        $obj = new stdClass();
        $obj->username = $_POST['username'];
        $obj->state = 'response';
        array_push($list2, $obj);
        $data_array = array(
            'friends' => json_encode($list2)
        );
        Database::get()->update('users', $data_array, 'username', $_POST['uid']);
        //send notification to uid
        $date = new DateTime('now');
        $data_array = array(
            'username' => $_POST['uid'],
            '_from' => $_POST['username'],
            'type' => 'normal',
            'content' => 'friend request',
            '_read' => 'no',
            '_view' => 'no',
            'time' => date_format($date,"Y/m/d H:i:s")
        );
        Database::get()->insert('notifications', $data_array);
    }