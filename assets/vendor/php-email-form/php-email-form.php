<?php
namespace PHP_Email_Form;

class PHP_Email_Form {
  public $to;
  public $from_name;
  public $from_email;
  public $subject;
  public $smtp;
  public $ajax;
  public $messages = array();

  public function add_message($content, $label = '', $length = 0) {
    if (!empty($content) && strlen($content) >= $length) {
      $this->messages[] = "$label: $content\n";
    }
  }

  public function send() {
    $email_text = implode("\n", $this->messages);

    $headers = "From: $this->from_name <$this->from_email>\r\n";
    $headers .= "Reply-To: $this->from_email\r\n";

    if (!empty($this->smtp)) {
      return $this->send_smtp($email_text);
    } else {
      return mail($this->to, $this->subject, $email_text, $headers) ? 'OK' : 'Email sending failed!';
    }
  }

  private function send_smtp($email_text) {
    require_once 'PHPMailer/PHPMailer.php';
    require_once 'PHPMailer/SMTP.php';
    require_once 'PHPMailer/Exception.php';

    $mail = new \PHPMailer\PHPMailer\PHPMailer(true);

    try {
      $mail->isSMTP();
      $mail->Host = $this->smtp['host'];
      $mail->SMTPAuth = true;
      $mail->Username = $this->smtp['username'];
      $mail->Password = $this->smtp['password'];
      $mail->SMTPSecure = $this->smtp['encryption'];
      $mail->Port = $this->smtp['port'];

      $mail->setFrom($this->from_email, $this->from_name);
      $mail->addAddress($this->to);
      $mail->addReplyTo($this->from_email, $this->from_name);

      $mail->Subject = $this->subject;
      $mail->Body    = $email_text;
      $mail->send();
      return 'OK';
    } catch (\PHPMailer\PHPMailer\Exception $e) {
      return 'Mailer Error: ' . $mail->ErrorInfo;
    }
  }
}
