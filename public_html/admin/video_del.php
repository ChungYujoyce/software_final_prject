<?php session_start(); ?>
<!DOCTYPE html>
<html>

<head>
<style>

body {background-color: azure;}

input{
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  box-sizing: border-box;
}

textarea{
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  box-sizing: border-box;
}

.container{
  margin:0 auto;
  width: 2000px;
}



</style>
</head>

<body>

<div class="container">

<form method = "POST" action = "video_del.php">
<h2>Delete video (index):</h2> <input type = "text" name = "index"><br><br>
<input type = "submit" value="bye"><br><br>
</form>

<?php 
date_default_timezone_set("Asia/Taipei");
$date = date("F j, Y, g:i a");

require_once('/export/home/team7/public_html/admin/config.php');
$dsn='mysql:host=140.114.87.219;dbname=videoh';
$dbh=new PDO($dsn,$CFG['mysql_username'], $CFG['mysql_password']);

$index = $_POST['index'];

//echo $index;

//deletion
$sql = "DELETE FROM videos WHERE `id`=$index";
$result = $dbh->exec($sql);

//list
$sql1 = "SELECT * from videos order by `id` DESC";
$sth1=$dbh->prepare($sql1);
$sth1->execute();

//list the comments
echo '<table border="0">';
while($row=$sth1->fetch()){
    echo '<tr><td>'.$row['id'].  '.</td><td>"'.$row['name'].'"</td></tr>';

}    echo '</table>';

?>


</div>

</body>
</html>