<?php
// 用參數決定載入某頁並讀取需要的資料
$parameter = strtolower($route->getParameter(1));
if($parameter=='apis') {
    include( 'apis/'.$route->getParameter(2).'.php');
}
else {
    $controller_array = scandir('controller');
    $controller_array = array_change_key_case($controller_array, CASE_LOWER);
    if (in_array($parameter.'.php', $controller_array)) {
        include( 'controller/'.$parameter.'.php');
    }
    else{
        include( 'controller/main.php');
    }
}