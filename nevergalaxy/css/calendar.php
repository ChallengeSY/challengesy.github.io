<?php

//Requires including timestamp.php somewhere before this on the same page
$dispTable = true; //Debug switch
$actNum = null;

echo "<table style=\"float: right;\" summary=\"\">\n";
echo "<thead>\n";
echo "<tr>\n";
echo "<th colspan=\"7\">$monthStr</th>\n";
echo "</tr>\n";
echo "<tr style=\"font-family: monospace; font-size: 125%;\">\n";
echo "<th>Sun</th>\n";
echo "<th>Mon</th>\n";
echo "<th>Tue</th>\n";
echo "<th>Wed</th>\n";
echo "<th>Thu</th>\n";
echo "<th>Fri</th>\n";
echo "<th>Sat</th>\n";
echo "</tr>\n";
echo "</thead>\n";
echo "<tfoot>\n";
echo "<tr>\n";
echo "<th colspan=\"7\">Server time: " . $timeStr . " UTC</th>\n";
echo "</tr>\n";
echo "</tfoot>\n";
echo "<tbody>\n";
if ($dispTable) {
	$firstFound = null;
	$firstSlot = date("w",$firstDayStamp);
	for ($w = 0; $w < 6; $w++) {
		echo "<tr>\n";
		for ($d = 0; $d < 7; $d++) {
			$refNum = 7 * $w + $d + 1;
			if (!$firstFound) {
				if ($d < $firstSlot) {
					echo "<td></td>\n";
				} else {
					if (date("j") == "1") {
						echo "<td class=\"numeric today\">1</td>\n";
					} else {
						echo "<td class=\"numeric\">1</td>\n";
					}
					$firstFound = $refNum;
				}
			} else {
				$actNum = $refNum - ($firstFound - 1);
				if ($actNum <= $maxDays) {
					if (date("j") == $actNum) {
						echo "<td class=\"numeric today\">$actNum</td>\n";
					} else {
						echo "<td class=\"numeric\">$actNum</td>\n";
					}
				} else {
					echo "<td></td>\n";
				}
			}
		}
		echo "</tr>\n";
		if ($actNum >= $maxDays) {
			break;
		}
	}
} else {
	echo "<tr>\n";
	echo "<td colspan=\"7\">Calendar broken</td>\n";
	echo "</tr>\n";
}
echo "</tbody>\n";
echo "</table>\n";

?>