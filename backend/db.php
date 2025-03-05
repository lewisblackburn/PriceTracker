
<?php

use PDO;

$pdo = new PDO("mysql:host=localhost;dbname=price_tracker", "tracker_user", "tracker_user_password");
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$secretKey = "vQkOkReCcVruFfa1VHrMl2HHtcjIECF5JCmvteeqYqo=";
