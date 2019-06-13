<?php // send email
    try { 
        $to = "bruce1198@gmail.com";
        $subject = "sample subject";
        $body = "sample content";
        $mail = new Mail(Config::MAIL_USER_NAME, Config::MAIL_USER_PASSWROD);
        $mail->setFrom(Config::MAIL_FROM, Config::MAIL_FROM_NAME);
        $mail->addAddress($to);
        $mail->subject($subject);
        $mail->body($body);
        if($mail->send()){
            echo "success";
        }else{
            echo "fail";
        }
    } catch(Exception $e) {
        echo 'Caught exception: ',  $e->getMessage();
        $error[] = $e->getMessage();
    }