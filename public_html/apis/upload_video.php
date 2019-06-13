<?php
    if(isset($_POST['username'])) {
        $array = array(
            'username' => $_POST['username']
        );
        //print_r($result[0]);
        $date = new DateTime('now');
        //print_r(date_format($date,"Y/m/d H:i:s"));
        $data_array = array(
            'description' => '',
            'reply' => json_encode(array()),
            'upload_user' => $_POST['username'],
            'upload_time' => date_format($date,"Y/m/d H:i:s")
        );
        if(isset($_FILES)){ // if new videos upload , show them
            $video = $_FILES['video'];
            $time = time();
            if(is_uploaded_file($video['tmp_name'])) {
                $info = pathinfo($video['name']);
                $ext = $info['extension']; // get the extension of the file
                $newname = $time.'.'.$ext; 
                $sourcePath = $video['tmp_name'];
                $targetPath = '/export/home/team7/public_html/videos/'.$newname;
            }
            if(move_uploaded_file($sourcePath,$targetPath)) {
                $data_array['name'] = $info['filename'];
                $data_array['video_id'] = $time;
                $data_array['ext'] = $ext;
                echo $time;
            }
            Database::get()->insert('videos', $data_array);
        }
    }
