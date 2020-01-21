<?php
function modChrome_ukpanel( $module, &$params, &$attribs )
{

	$paneltype = $attribs['paneltype'] ? 'uk-panel-'.$attribs['paneltype'] : '';
	$extraclass = $attribs['class'] ? $attribs['class'] : '';

	echo '<div class="uk-panel '.$paneltype.' '.$extraclass.' '.$params->get( 'moduleclass_sfx' ) .'" >';

	if ($module->showtitle)
	{
	  echo '<h2 class="uk-panel-title">' .$module->title .'</h2>';
	}

	echo $module->content;

	echo '</div>';
  }
?>
