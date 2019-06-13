<?php
    // username accept request from uid
    if(isset($_POST['username']) && isset($_POST['uid'])) {
        //update friend state between two users
        $result = Database::get()->execute('SELECT friends FROM users WHERE username=?', array($_POST['username']));
        $list1 = json_decode($result[0]['friends']);
        for($i=0; $i<sizeof($list1); $i++) {
            if($list1[$i]->username==$_POST['uid']) {
                $list1[$i]->state = 'friend';
            }
        }
        $data_array = array(
            'friends' => json_encode($list1)
        ); // update friend circle
        Database::get()->update('users', $data_array, 'username', $_POST['username']);
        $result = Database::get()->execute('SELECT friends FROM users WHERE username=?', array($_POST['uid']));
        $list2 = json_decode($result[0]['friends']);
        for($i=0; $i<sizeof($list2); $i++) {
            if($list2[$i]->username==$_POST['username']) {
                $list2[$i]->state = 'friend';
            }
        }
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
            'content' => 'friend accept',
            '_read' => 'no',
            '_view' => 'no',
            'time' => date_format($date,"Y/m/d H:i:s")
        );
        Database::get()->insert('notifications', $data_array);
    }