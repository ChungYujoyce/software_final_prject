<?php // create reply and update
    if(isset($_POST['username'])) { 
        $result = Database::get()->execute('SELECT reply FROM videos WHERE id = ?', array($_POST['id']));
        $replies = $result[0]['reply'];
        print_r($replies);
        $date = new DateTime('now');
        $reply = array(
            'username' => $_POST['username'],
            'content' => $_POST['content'],
            'time' => date_format($date,"Y/m/d H:i:s")
        );
        array_push($replies, $reply);
        $replies = json_encode($replies);
        $data_array = array(
            'reply' => $replies
        );
        Database::get()->update('videos', $data_array, 'video_id', $_POST['video_id']);
    }