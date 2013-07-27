<?php
require_once __DIR__.'/app/config/app.php';
require_once __DIR__.'/app/Web.php';

$app = new App_Web();
$app->start();