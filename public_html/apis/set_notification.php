<?php
    if(isset($_POST['username']) && isset($_POST['view'])) {
        Database::get()->update('notifications', array('_view'=>'yes'), 'username', $_POST['username']);
    }
    else if(isset($_POST['username']) && isset($_POST['read'])&&isset($_POST['id'])) {
        Database::get()->update('notifications', array('_read'=>'yes'), 'id', $_POST['id']);
    }