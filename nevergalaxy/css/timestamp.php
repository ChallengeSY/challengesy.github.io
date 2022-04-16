<?php

$dayNum = date("j");
$maxDays = date("t");
$monthStr = date("F o");
$timeStr = date("H:i");

$curSec = time();
$curMin = floor($curSec/60);
$curHour = floor($curMin/60);
$curDay = floor($curHour/24);

$firstDay = $curDay - ($dayNum - 1);
$firstDayStamp = $firstDay * 24 * 60 * 60; //Convert to seconds

?>
