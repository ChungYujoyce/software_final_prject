<?php
    if(isset($_SESSION['username'])) {
        include('views/html/subscribe.html');
        echo '<div class="session" style="display:none;">'.$_SESSION['username'].'</div>';
    }
    else {
        header('Location: main');
    }