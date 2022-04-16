<?php

function cleanse($field) {
	$field = trim($field);
	$field = stripslashes($field);
	$field = htmlspecialchars($field);
	
	return $field;
}

?>
