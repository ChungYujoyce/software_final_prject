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

<form method = "POST" action = "user_del.php">
<h2>Delete users (id):</h2> <input type = "text" name = "id"><br><br>
<input type = "submit" value="bye"><br><br>
</form>

<?php 
date_default_timezone_set("Asia/Taipei");
$date = date("F j, Y, g:i a");

require_once('/export/home/team7/public_html/admin/config.php');
$dsn='mysql:host=140.114.87.219;dbname=videoh';
$dbh=new PDO($dsn,$CFG['mysql_username'], $CFG['mysql_password']);

//$username = $_POST['username'];
$id = $_POST['id'];
//echo $index;

//deletion
$sql = "DELETE FROM users WHERE `id` = $id";

$result = $dbh->exec($sql);

//list
$sql1 = "SELECT * from users order by `username` ASC";
$sth1=$dbh->prepare($sql1);
$sth1->execute();

//list the comments
echo '<table border="0">';
echo '<tr><td>'.'id'.  '.</td><td>"'.'username'.'"</td><td>"'.'name'.'"</td></tr>';
while($row=$sth1->fetch()){
    echo '<tr><td>'.$row['id'].  '.</td><td>"'.$row['username'].'"</td><td>"'.$row['name'].'"</td></tr>';

}    echo '</table>';

?>


</div>

</body>
</html>