<?php
    if(isset($_POST['username']) && isset($_POST['view'])) {
        Database::get()->update('messages', array('_view'=>'yes'), '_to', $_POST['username']);
    }
    else if(isset($_POST['username']) && isset($_POST['read'])&&isset($_POST['id'])) {
        Database::get()->update('messages', array('_read'=>'yes'), 'id', $_POST['id']);
    }