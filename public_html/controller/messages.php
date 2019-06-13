<?php
    if(isset($_SESSION['username'])) {
        include('views/html/message.html');
        echo '<div class="session" style="display:none;">'.$_SESSION['username'].'</div>';
        if(isset($_GET['uid'])) {
            echo '<div class="uid" style="display:none;">'.$_GET['uid'].'</div>';
        }
        else
            echo '<div class="uid" style="display:none;"></div>';
    }
    else {
        header('Location: main');
    }