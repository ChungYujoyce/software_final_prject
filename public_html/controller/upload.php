<?php
    if(isset($_SESSION['username'])) {
        include('views/html/upload.html');
        echo '<div class="session" style="display:none;">'.$_SESSION['username'].'</div>';
    }
    else {
        header('Location: main');
    }