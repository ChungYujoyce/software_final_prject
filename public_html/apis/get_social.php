<?php
    if(isset($_POST['username'])) {
        $all = Database::get()->execute('SELECT * FROM notifications WHERE username=? AND type=?', array($_POST['username'], 'normal'));
        //print_r($all);
        $noti = array();
        for($i=0; $i<sizeof($all); $i++) {
            if($all[$i]['content']=='subscribe' || $all[$i]['content']=='like' || $all[$i]['content']=='friend accept') {
                array_push($noti, $all[$i]);
            }
        }
        print_r(json_encode($noti));
    }