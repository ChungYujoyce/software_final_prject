<?php
    include('views/html/watch.html');
    echo '<div class="video-id" style="display:none;">'.$_GET['v'].'</div>';
    if(isset($_GET['playList'])) {
        echo '<div class="play-list" style="display:none;">'.$_GET['playList'].'</div>';
        echo '<div class="index" style="display:none;">'.$_GET['index'].'</div>';
    }
    if(isset($_SESSION['darkmode']))
        echo '<div class="dark-mode" style="display:none;">'.$_SESSION['darkmode'].'</div>';
    else
        echo '<div class="dark-mode" style="display:none;">no</div>';
    if(isset($_SESSION['username'])) 
        echo '<div class="session" style="display:none;">'.$_SESSION['username'].'</div>';
    else 
        echo '<div class="session" style="display:none;">visitor</div>';