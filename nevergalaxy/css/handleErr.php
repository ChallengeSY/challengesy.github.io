<?php

function catchError($errno, $errstr) {
	echo "<b>Error:</b> [$errno] $errstr";
	die();
}

set_error_handler("catchError");

?>
