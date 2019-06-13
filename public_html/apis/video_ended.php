<?php
    if(isset($_POST['username']) && isset($_POST['video_id'])) {
        $result = Database::get()->execute('SELECT view_count FROM videos WHERE video_id=?', array($_POST['video_id']));
        $cnt = $result[0]['view_count'];
        $cnt++;
        $data_array = array(
            'view_count' => $cnt
        );
        Database::get()->update('videos', $data_array, 'video_id', $_POST['video_id']);
        $result = Database::get()->execute('SELECT view_list FROM users WHERE username=?', array($_POST['username']));
        $list = json_decode($result[0]['view_list']);
        if(in_array($_POST['video_id'], $list)) {
            $list = array_diff($list, array($_POST['video_id']));
            array_push($list, $_POST['video_id']);
            $list = join(',', $list);
            $list = '['.$list.']';
        }
        else {
            array_push($list, $_POST['video_id']);
            $list = join(',', $list);
            $list = '['.$list.']';
        }
        $data_array = array(
            'view_list' => $list
        );
        Database::get()->update('users', $data_array, 'username', $_POST['username']);
    } 