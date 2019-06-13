<?php //show who give you a like
    if(isset($_POST['username'])) {
        $result = Database::get()->execute('SELECT like_list FROM users WHERE username=?', array($_POST['username']));
        $like_list = json_decode($result[0]['like_list']);
        $in  = str_repeat('?,', sizeof($like_list)-1) . '?';
        $video_list = Database::get()->execute('SELECT * FROM videos WHERE video_id IN ('.$in.') AND permission=?', array_merge($like_list, ['public']));
        $list = array_reverse($video_list);
        print_r(json_encode($list));
    }