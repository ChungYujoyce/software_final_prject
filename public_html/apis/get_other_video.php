<?php
    function mySort($a, $b) {
        return (int)$b['view_count'] - (int)$a['view_count'];
    }
    if(isset($_POST['video_id']) && isset($_POST['username'])) {
        if($_POST['username'] != 'visitor') { // not visitor can do things below
            $result = Database::get()->execute('SELECT view_list FROM users WHERE username=?', array($_POST['username']));
            $view_list_origin = json_decode($result[0]['view_list']);
            if(in_array($_POST['video_id'], $view_list_origin)) {
                $view_list = array_diff($view_list_origin, array($_POST['video_id']));
            }
            else {
                $view_list = $view_list_origin;
            }
            $cnt = sizeof($view_list);
            if($cnt==0) {
                $hot = Database::get()->execute('SELECT * FROM videos WHERE video_id!=? AND permission=?', array($_POST['video_id'], 'public'));
                usort($hot, "mySort");
                $result = array();
                for($i=0; $i<sizeof($hot); $i++) {
                    array_push($result, $hot[$i]);
                    if($i==19)
                        break;
                }
            }
            else {
                $ino  = str_repeat('?,', sizeof($view_list_origin)-1) . '?';
                $in  = str_repeat('?,', $cnt-1) . '?';
                $view_video = Database::get()->execute('SELECT * FROM videos WHERE video_id IN ('.$in.') AND permission=?', array_merge($view_list, ['public']));
                $hot = Database::get()->execute('SELECT * FROM videos WHERE video_id NOT IN ('.$ino.') AND permission=?', array_merge($view_list_origin, ['public']));
                $result = $view_video;
                usort($hot, "mySort");
                for($i=0; $i<sizeof($hot); $i++) {
                    array_push($result, $hot[$i]);
                    if($i==19-$cnt)
                        break;
                }
            }
        }
        else {
            $hot = Database::get()->execute('SELECT * FROM videos WHERE video_id!=? AND permission=?', array($_POST['video_id'], 'public'));
            usort($hot, "mySort");
            $result = array();
            for($i=0; $i<sizeof($hot); $i++) {
                array_push($result, $hot[$i]);
                if($i==19)
                    break;
            }
        }
        print_r(json_encode($result));
    }