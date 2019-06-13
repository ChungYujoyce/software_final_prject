<?php
    $email = $_POST['email'];
    $result = Database::get()->execute('SELECT username FROM users WHERE email = ?', array($email));
    if(count($result)!=0) {
        $random = 6;
        for($i=1; $i<=$random; $i++){
            $c=rand(1,3);
            if($c==1) {
                $a=rand(97,122);
                $b=chr($a);
            }
            if($c==2) {
                $a=rand(65,90);
                $b=chr($a);
            }
            if($c==3)
                $b=rand(0,9);
            $token .= $b;
        }
        $data_array = array(
            'resetToken' => $token
        );
        Database::get()->update('users', $data_array,'email', $email);
        try { // reset password
            $to = $_POST['email'];
            $subject = "MSGBoard"."=?UTF-8?B?".base64_encode("密碼重置")."?=";
            $body = "您好，以下為您的驗證碼:<br>".$token."<br>若此操作並非您本人，請不用理會。";
            $mail = new Mail(Config::MAIL_USER_NAME, Config::MAIL_USER_PASSWROD);
            $mail->setFrom(Config::MAIL_FROM, Config::MAIL_FROM_NAME);
            $mail->addAddress($to);
            $mail->subject($subject);
            $mail->body($body);
            if($mail->send()) {
                echo $result[0]['username'];
            }
        } catch(Exception $e) {
            echo 'fail';
            $error[] = $e->getMessage();
        }
    }
    else {
        echo 'fail';
    }