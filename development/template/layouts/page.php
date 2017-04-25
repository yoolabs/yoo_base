

<?php


// RENDER CONTENT START ==========================================================

ob_start();
require 'page_home.php';
$home = ob_get_clean();
YooGrid::SetHomeContent($home);

if(!$isHome) {
	ob_start();
	require 'page_gridbox.php';
	$content = ob_get_clean();
	YooGrid::SetItemContent($content);
}


// RENDER CONTENT END ==========================================================
// if is async, get buffer and wrap async html around content now.


if($isAsync) {
	echo $content;
} else {
	YooGrid::Render();
}
?>
