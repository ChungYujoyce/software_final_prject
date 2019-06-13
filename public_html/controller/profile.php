<?php
    if(isset($_SESSION['username'])) {
        include('views/html/profile.html');
        echo '<div class="session" style="display:none;">'.$_SESSION['username'].'</div>';
        echo '<div class="uid" style="display:none;">'.$_GET['u'].'</div>';
    }
    else {
        include('views/html/profile.html');
        echo '<div class="session" style="display:none;">visitor</div>';
        echo '<div class="uid" style="display:none;">'.$_GET['u'].'</div>';
    }