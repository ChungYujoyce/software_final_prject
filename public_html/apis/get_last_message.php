<?php
    function mySort($a, $b) { // sort  messages by time
        return strtotime($a["send_time"]) - strtotime($b["send_time"]);
    }
    if(isset($_POST['username'])) {
        $result = Database::get()->execute('SELECT * FROM messages WHERE _from=?', array($_POST['username']));
        //print_r($result);
        $preview = array();
        for($i=0; $i<sizeof($result); $i++) { // get all messages left by "you"
            if(!isset($preview[$result[$i]['_to']])) {
                $preview[$result[$i]['_to']] = array($result[$i]);
            }
            else {
                array_push($preview[$result[$i]['_to']], $result[$i]);
            }
        }
        $result = Database::get()->execute('SELECT * FROM messages WHERE _to=?', array($_POST['username']));
        for($i=0; $i<sizeof($result); $i++) { // get all messages by "who you chat with"
            if(!isset($preview[$result[$i]['_from']])) {
                $preview[$result[$i]['_from']] = array($result[$i]);
            }
            else {
                array_push($preview[$result[$i]['_from']], $result[$i]);
            }
        }
        //print_r($preview);
        $unview = 0;
        foreach($preview as $key => $value) {
            $last = sizeof($value) - 1;
            usort($value, "mySort");
            if($value[$last]['_view']=='no' && $value[$last]['_to']==$_POST['username']) {
                $unview++;
            }
            $preview[$key] = $value[$last];
        }
        usort($preview, "mySort");
        $list = array_reverse($preview);
        print_r(json_encode($list)); //show all messages
    }