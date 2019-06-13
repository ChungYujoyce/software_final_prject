<?php
    if(isset($_POST['uid'])) {
        $result = Database::get()->execute('SELECT * FROM videos WHERE upload_user = ? AND permission=?',array($_POST['uid'], 'public'));
        print_r(json_encode($result));
    }