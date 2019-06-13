<?php
    //_from send message to _to
    if(isset($_POST['from']) && isset($_POST['to']) && isset($_POST['type']) && isset($_POST['content'])) {
        //save message to db
        $type = $_POST['type'];
        $from = $_POST['from'];
        $to = $_POST['to'];
        $content = $_POST['content'];
        $date = new DateTime('now');
        $data_array = array(
            'type' => $type,
            '_from' => $from,
            '_to' => $to,
            'content' => $content,
            'send_time' => date_format($date,"Y/m/d H:i:s")
        );
        if($type=='video') {
            $data_array['video_id'] = $_POST['video_id'];
            $data_array['begin'] = $_POST['begin'];
            $data_array['end'] = $_POST['end'];
        }
        Database::get()->insert('messages', $data_array);
        //send notification to user

        $data_array = array(
            'username' => $to,
            '_from' => $from,
            'type' => 'message',
            'content' => $content,
            '_read' => 'no',
            '_view' => 'no',
            'time' => date_format($date,"Y/m/d H:i:s")
        );
        Database::get()->insert('notifications', $data_array);
    }