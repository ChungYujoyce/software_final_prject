<?php
    if(isset($_POST['username'])) {
        if(isset($_POST['get']) && isset($_POST['uid'])) { // get subscription by users
            $result = Database::get()->execute('SELECT subscribe_list FROM users WHERE username=?', array($_POST['username']));
            $sub_list = json_decode($result[0]['subscribe_list']);
            for($i=0; $i<sizeof($sub_list); $i++) {
                if($sub_list[$i]==$_POST['uid']) {
                    echo 'yes';
                    exit;
                }
            }
            echo 'no';
            exit;
        }
        else if(isset($_POST['get']) && isset($_POST['video_id'])) { // get subscription link the to video
            $result = Database::get()->execute('SELECT upload_user FROM videos WHERE video_id=?', array($_POST['video_id']));
            $uid = $result[0]['upload_user'];
            $result = Database::get()->execute('SELECT subscribe_list FROM users WHERE username=?', array($_POST['username']));
            $sub_list = json_decode($result[0]['subscribe_list']);
            for($i=0; $i<sizeof($sub_list); $i++) {
                if($sub_list[$i]==$uid) {
                    echo 'yes';
                    exit;
                }
            }
            echo 'no';
            exit;
        }
        //username subscribe the channel of uid
        else if(isset($_POST['uid'])) {
            $result = Database::get()->execute('SELECT subscribe_list FROM users WHERE username=?', array($_POST['username']));
            $sub_list = json_decode($result[0]['subscribe_list']);
            for($i=0; $i<sizeof($sub_list); $i++) {
                if($sub_list[$i]==$_POST['uid']) {
                    $content = 'unsubscribe';
                    $sub_list = array_diff($sub_list, array($_POST['uid']));
                    Database::get()->update('users', array('subscribe_list'=>json_encode($sub_list)), 'username', $_POST['username']);

                    $date = new DateTime('now');
                    $data_array = array(
                        'username' => $_POST['uid'],
                        '_from' => $_POST['username'],
                        'type' => 'normal',
                        'content' => $content,
                        '_read' => 'no',
                        '_view' => 'no',
                        'time' => date_format($date,"Y/m/d H:i:s")
                    );
                    Database::get()->insert('notifications', $data_array);
                    exit;
                }
            }
            array_push($sub_list, $_POST['uid']);
            $content = 'subscribe';
            Database::get()->update('users', array('subscribe_list'=>json_encode($sub_list)), 'username', $_POST['username']);
            //send the notification to the owner of the video
            
            $date = new DateTime('now');
            $data_array = array(
                'username' => $_POST['uid'],
                '_from' => $_POST['username'],
                'type' => 'normal',
                'content' => $content,
                '_read' => 'no',
                '_view' => 'no',
                'time' => date_format($date,"Y/m/d H:i:s")
            );
            Database::get()->insert('notifications', $data_array);  
        }
        //username subscribe the channel by video id
        else if(isset($_POST['video_id'])) {
            $result = Database::get()->execute('SELECT upload_user FROM videos WHERE video_id=?', array($_POST['video_id']));
            $uid = $result[0]['upload_user'];
            $result = Database::get()->execute('SELECT subscribe_list FROM users WHERE username=?', array($_POST['username']));
            $sub_list = json_decode($result[0]['subscribe_list']);
            for($i=0; $i<sizeof($sub_list); $i++) {
                if($sub_list[$i]==$uid) {
                    $content = 'unsubscribe';
                    $sub_list = array_diff($sub_list, array($uid));
                    Database::get()->update('users', array('subscribe_list'=>json_encode($sub_list)), 'username', $_POST['username']);
                    $date = new DateTime('now');
                    $data_array = array(
                        'username' => $uid,
                        '_from' => $_POST['username'],
                        'type' => 'normal',
                        'content' => $content,
                        '_read' => 'no',
                        '_view' => 'no',
                        'time' => date_format($date,"Y/m/d H:i:s")
                    );
                    Database::get()->insert('notifications', $data_array);
                    exit;
                }
            }
            array_push($sub_list, $uid);
            $content = 'subscribe';
            Database::get()->update('users', array('subscribe_list'=>json_encode($sub_list)), 'username', $_POST['username']);
            //send the notification to the owner of the video
            
            $date = new DateTime('now');
            $data_array = array(
                'username' => $uid,
                '_from' => $_POST['username'],
                'type' => 'normal',
                'content' => $content,
                '_read' => 'no',
                '_view' => 'no',
                'time' => date_format($date,"Y/m/d H:i:s")
            );
            Database::get()->insert('notifications', $data_array);
        }
    }