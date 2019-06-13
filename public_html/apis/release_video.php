<?php
    if(isset($_POST['username'])) { // show who upload the video
        $data_array = array(
            'name' => $_POST['name'],
            'description' => $_POST['desc'],
            'permission' => 'public'
        );
        try {
            Database::get()->update('videos', $data_array, 'video_id', $_POST['video_id']);
        } catch(Exception $e) {

        }
        //echo $_POST['imageData'];
        $data = substr($_POST['imageData'], strpos($_POST['imageData'], ",") + 1);
        $decodedData = base64_decode($data);
        $fp = fopen('/export/home/team7/public_html/videos/snapshots/'.$_POST['video_id'].".png", 'wb');
        fwrite($fp, $decodedData);
        fclose($fp);
        echo 'success';
    }
    //echo "/canvas.png";