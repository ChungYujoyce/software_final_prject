<?php
    if(isset($_POST['username'])) {
        Database::get()->delete('messages', 'id', $_POST['id']);
        echo 'success';
    }