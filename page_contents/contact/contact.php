<!DOCTYPE html>
<head>
<html>
<title>AKamienski</title>
<?php include '/var/www/html/start.php'; ?>

<style>
<?php include '/var/www/html/pageStyle.css'; ?>

#message {
	resize: none;
}

#main {
	width: 50em;
}

table {
	width: 100%
}

input {
	width: 100%;
}

#fbook, #insta, #linkedin, #git {
	font-size: 50px;
}

</style>
<script src='https://www.google.com/recaptcha/api.js'></script>
</head>
<body>
	<center>
		<?php include '/var/www/html/header.php'; ?>
		<div id="main">
			<h1 class="w3-xlarge">CONTACT</h1>

			<?php
				if(!empty($_POST) && !empty($_POST['g-recaptcha-response'])) {
					$data = array(
					    'secret' => '6LexD38UAAAAAPoe24aXbRzXVJYZeU6JEjiS-sL0',
					    'response' => $_POST['g-recaptcha-response'],
					    'remoteIp' => $_SERVER['REMOTE_ADDR']
					);

					$url = 'https://www.google.com/recaptcha/api/siteverify';
					$options = array(
					    'http' => array(
					        'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
					        'method'  => 'POST',
					        'content' => http_build_query($data)
					    )
					);
					$context  = stream_context_create($options);
					$result = file_get_contents($url, false, $context);

					if($result['success']) {
						$to_email = 'arthur.kamienski@gmail.com';

						if($_POST['name'] != '') {
							$name = $_POST['name'];
						} else {
							$name = 'anonymous';
						}

						$subject = 'New message sent by ' . $name;
						$message = "From $name:\n" . $_POST['message'] . "\n";

						if($_POST['email']  != '') {
							$subject = "$subject (". $_POST['email'].")";
							$message = "$message\n Contact email: " . $_POST['email'];
						}

						$headers = 'From: contact@akamienski.ml';

						mail($to_email,$subject,$message,$headers);

						echo "<h3>Your message has been sent!</h3><br> You will be fowarded to the initial page in <a id=time_to_foward>5</a> seconds<br> (If you are not fowarded after that or don't want to wait, click <a href=\"contact\">here</a>).
							<script type=\"text/javascript\">
								window.setInterval(function(){
									var time = document.getElementById('time_to_foward').textContent - 1;
									document.getElementById('time_to_foward').textContent = time ;

									if(time == 0) {
										window.location = \"http://www.akamienski.ml/contact\";
									}
								},1000);
							</script>
						";
					}
				} else {
					if(!empty($_POST) && empty($_POST['g-recaptcha-response'])) {
						echo "
						<script type=\"text/javascript\">
							window.onload = function() {
								alert('You need to fill out the reCAPTCHA before sending the message!');
							}
						</script>";
					}

					echo '
							If you want to contact me, you can send me an e-mail:

							<h4>arthur.kamienski@gmail.com</h4>

							... or reach to me in one of the following networks:<br><br>

							<a href="http://www.facebook.com/arthur.kamienski" target="_blank"><i id="fbook" class="fa fa-facebook-official w3-hover-opacity"></i></a>
							<a href="http://www.instagram.com/arthurkamienski" target="_blank"><i id="insta" class="fa fa-instagram w3-hover-opacity"></i></a>
							<a href="http://www.linkedin.com/in/arthur-kamienski-90174a16a" target="_blank"><i id="linkedin" class="fa fa-linkedin w3-hover-opacity"></i></a>

							<br><br>
							but you can also <br>

							<hr>

							<h1 class="w3-xlarge">SEND ME A MESSAGE NOW!</h1>

							Here you can also send me a message, directly to my e-mail, using this website!<br><br>

							This is a feature I developed to better understand how I could use my webserver to send e-mails. Now that it is done, I thought it would be fun to see what people want to tell me.<br><br>

							You don\'t have to give a name or an e-mail if you don\'t want to (you can send the message anonymously!) but that info will be really helpful if you want me to reply.<br><br>

							Have fun and <b>don\'t spam me too much</b>.<br><br> Seriously. (not really)<br><br>

							<form action="contact" method="POST">
								<div>
									<table style="width: 50%;">
										<tr>					
											<td style="width: 6em">
												<b>Your name</b>:<br>
												<b>Your E-mail</b>: 
											</td>
											<td>
												<input type="text" name="name"><br>
												<input type="email" name="email"><br>
											</td>
										</tr>
									</table>
									<br>
									<b>Message</b><font color="red">*</font>:<br><textarea id="message" type="text" name="message" rows="10" cols="70" required="required"></textarea><br>
									<font color="red">* = Required field</font>
								</div>
								<br>
								<div class="g-recaptcha" data-sitekey="6LexD38UAAAAAGO4wKU61eJO92t0vEgkCv-AixwI"></div>
								<br>
								<button>Send!</button>
							</form>
					';
				}
			?>
		</div>
		
	</center>
	<?php include '/var/www/html/footer.php'; ?>
</body>
</html>