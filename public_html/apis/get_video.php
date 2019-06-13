<?php // get video info (id & username)
    if(isset($_POST['video_id'])) {
        $result = Database::get()->execute('SELECT * FROM videos WHERE video_id=? AND permission=?', array($_POST['video_id'], 'public'));
        //print_r($result);
    }
    else if(isset($_POST['username'])) { //subscribe list
        $result = Database::get()->execute('SELECT subscribe_list FROM users WHERE username=?', array($_POST['username']));
        $subscribe_list = json_decode($result[0]['subscribe_list']);
        $in  = str_repeat('?,', sizeof($subscribe_list)-1) . '?';
        $result = Database::get()->execute('SELECT * FROM videos WHERE upload_user IN ('.$in.') AND permission=?', array_merge($subscribe_list, ['public']));
    }
    else {
        $result = Database::get()->execute('SELECT * FROM videos WHERE permission=?', array('public'));
    }
    print_r(json_encode($result));