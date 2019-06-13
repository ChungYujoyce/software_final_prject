<?php
    //username like the video which has the video_id
    if(isset($_POST['username']) && isset($_POST['video_id'])) {
        if(isset($_POST['get'])) {//get if user like the video
            $result = Database::get()->execute('SELECT like_list FROM users WHERE username=?', array($_POST['username']));
            $like_list = json_decode($result[0]['like_list']);
            for($i=0; $i<sizeof($like_list); $i++) {
                if($like_list[$i]==$_POST['video_id']) {
                    echo 'yes';
                    exit;
                }
            }
            echo 'no';
            exit;
        }
        else if(isset($_POST['update'])) { //update if user like the video
            $content = '';
            //update like_list of user
            $result = Database::get()->execute('SELECT like_count FROM videos WHERE video_id=?', array($_POST['video_id']));
            $cnt = $result[0]['like_count'];
            $result = Database::get()->execute('SELECT like_list FROM users WHERE username=?', array($_POST['username']));
            $like_list = json_decode($result[0]['like_list']);
            for($i=0; $i<sizeof($like_list); $i++) {
                if($like_list[$i]==$_POST['video_id']) {
                    $content = 'unlike';
                    $cnt--;
                    $like_list = array_diff($like_list, array($_POST['video_id']));
                    Database::get()->update('users', array('like_list'=>json_encode($like_list)), 'username', $_POST['username']);
                    Database::get()->update('videos', array('like_count'=>$cnt), 'video_id', $_POST['video_id']);
                    $date = new DateTime('now');
                    $result = Database::get()->execute('SELECT upload_user FROM videos WHERE video_id=?', array($_POST['video_id']));
                    $to = $result[0]['upload_user'];
                    $data_array = array(
                        'username' => $to,
                        '_from' => $_POST['username'],
                        'type' => 'normal',
                        'content' => $content,
                        '_read' => 'no',
                        '_view' => 'no',
                        '_link' => $_POST['video_id'],
                        'time' => date_format($date,"Y/m/d H:i:s")
                    );
                    Database::get()->insert('notifications', $data_array);   
                    exit;
                }
            }
            array_push($like_list, $_POST['video_id']);
            $content = 'like';
            $cnt++;
            Database::get()->update('videos', array('like_count'=>$cnt), 'video_id', $_POST['video_id']);
            Database::get()->update('users', array('like_list'=>json_encode($like_list)), 'username', $_POST['username']);
            //send the notification to the owner of the video
            
            $date = new DateTime('now');
            $result = Database::get()->execute('SELECT upload_user FROM videos WHERE video_id=?', array($_POST['video_id']));
            $to = $result[0]['upload_user'];
            $data_array = array(
                'username' => $to,
                '_from' => $_POST['username'],
                'type' => 'normal',
                'content' => $content,
                '_read' => 'no',
                '_view' => 'no',
                '_link' => $_POST['video_id'],
                'time' => date_format($date,"Y/m/d H:i:s")
            );
            Database::get()->insert('notifications', $data_array);            
        }

    }