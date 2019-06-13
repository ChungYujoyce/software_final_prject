<?php
    include('views/html/register.html');
    if(isset($_SESSION['wrong'])) {
        echo '<div class="wrong" style="display:none;">'.$_SESSION['wrong'].'</div>';
        unset($_SESSION['wrong']);
    }
    else {
        echo '<div class="wrong" style="display:none;"></div>';
    }
    if(isset($_SESSION['duplicate'])) {
        echo '<div class="duplicate" style="display:none;">'.$_SESSION['duplicate'].'</div>';
        unset($_SESSION['duplicate']);
    }
    else {
        echo '<div class="duplicate" style="display:none;"></div>';
    }