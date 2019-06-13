<?php
    include('views/html/main.html');
    if(isset($_SESSION['darkmode']))
        echo '<div class="dark-mode" style="display:none;">'.$_SESSION['darkmode'].'</div>';
    else
        echo '<div class="dark-mode" style="display:none;">no</div>';
    if(isset($_SESSION['username'])) {
        echo '<div class="session" style="display:none;">'.$_SESSION['username'].'</div>';
    }
    else {
        echo '<div class="session" style="display:none;">visitor</div>';
    }