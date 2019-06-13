<?php
    //print_r($_POST);
    if(isset($_POST['username'])) {
        $data_array = array(
            'name' => $_POST['name'],
            'description' => $_POST['content']
        );
        Database::get()->update('videos', $data_array, 'video_id', $_POST['video_id']);
    }