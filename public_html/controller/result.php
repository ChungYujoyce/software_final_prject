<?php
    if(isset($_SESSION['username'])) {
        include('views/html/result.html');
        echo '<div class="search-query" style="display:none;">'.$_GET['search_query'].'</div>';
        echo '<div class="session" style="display:none;">'.$_SESSION['username'].'</div>';
    }
    else {
        include('views/html/result.html');
        echo '<div class="search-query" style="display:none;">'.$_GET['search_query'].'</div>';
        echo '<div class="session" style="display:none;">visitor</div>';
    }