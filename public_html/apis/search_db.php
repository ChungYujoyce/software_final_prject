<?php
    if(isset($_POST['begin']) && isset($_POST['key']) && isset($_POST['username']) && isset($_POST['friend'])) {
        $users = Database::get()->execute('SELECT username, name, url FROM users WHERE name LIKE ? AND username!=?', array($_POST['key'].'%', $_POST['username']));
        $friend = Database::get()->execute('SELECT friends FROM users WHERE username=?', array($_POST['username']));
        $friend = json_decode($friend[0]['friends']);
        $result = array();
        for($i=0; $i<sizeof($users); $i++) {
            for($j=0; $j<sizeof($friend); $j++) {
                if($users[$i]['username']==$friend[$j]->username && $friend[$j]->state=='friend') {
                    array_push($result, $users[$i]);
                }
            }
        }
        print_r(json_encode($result));
    }
    else if(isset($_POST['begin']) && isset($_POST['key']) && isset($_POST['username'])) {
        $users = Database::get()->execute('SELECT username, name, url FROM users WHERE name LIKE ? AND username!=?', array($_POST['key'].'%', $_POST['username']));
        $videos = Database::get()->execute('SELECT video_id, name FROM videos WHERE name LIKE ? AND permission=?', array($_POST['key'].'%', 'public'));
        $result = new stdClass();
        $result->users = $users;
        $result->videos = $videos;
        print_r(json_encode($result));
    }
    else if(isset($_POST['key']) && isset($_POST['username'])) {
        $users = Database::get()->execute('SELECT username, name, url FROM users WHERE name LIKE ? and username!=?', array('%'.$_POST['key'].'%', $_POST['username']));
        $videos = Database::get()->execute('SELECT * FROM videos WHERE name LIKE ? AND permission=?', array('%'.$_POST['key'].'%', 'public'));
        $result = new stdClass();
        $result->users = $users;
        $result->videos = $videos;
        print_r(json_encode($result));
    }
    