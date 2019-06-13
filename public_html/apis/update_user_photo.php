<?php
    if(isset($_POST['username']) && isset($_FILES)) {
        //print_r($_FILES['photo']);
        $photo = $_FILES['photo'];
        if(is_uploaded_file($photo['tmp_name'])) {
            $info = pathinfo($photo['name']);
            $ext = $info['extension']; // get the extension of the file
            $newname = $_POST['username'].'.'.$ext; 
            $sourcePath = $photo['tmp_name'];
            $page_file_temp = $_SERVER["PHP_SELF"];
            $page_directory = dirname($page_file_temp);
            $targetPath = '/export/home/team7/public_html/users/'.$newname;
            //list($scriptPath) = get_included_files();
            //echo $scriptPath;
            //echo $targetPath;
            //echo $page_directory;
        }
        if(move_uploaded_file($sourcePath,$targetPath)) {
            echo 'https://videoh.2y.cc/users/'.$newname;
            $data_array = array(
                'url' => 'https://videoh.2y.cc/users/'.$newname
            );
            Database::get()->update('users', $data_array,'username', $_POST['username']);
        }
    }