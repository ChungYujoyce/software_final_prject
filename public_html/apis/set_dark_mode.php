<?php
    if(isset($_POST['dark'])) {
        if($_POST['dark']=='yes') {
            $_SESSION['darkmode'] = 'yes';
            echo 'dark';
        }
        else {
            echo 'light';
            $_SESSION['darkmode'] = 'no';
        }
    }