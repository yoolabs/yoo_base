<?php
___phpbanner___;

// Including fallback code for the placeholder attribute in the search field.
JHtml::_('jquery.framework');
JHtml::_('script', 'system/html5fallback.js', false, true);

$option = JFactory::getApplication()->input->getVar('option','');
$view = JFactory::getApplication()->input->getVar('view','');
$value = JFactory::getApplication()->input->getVar('searchword','');





?>
<div class="search<?php echo $moduleclass_sfx ?>">
	<form action="<?php echo JRoute::_('index.php');?>" method="post" class="form-inline">
		<?php
			$output = '<label for="mod-search-searchword" class="element-invisible">' . $label . '</label> ';
			$output .= '<input name="searchword" id="mod-search-searchword" maxlength="' . $maxlength
					.  '"  class="inputbox search-query" type="text" autocomplete="off" '. ($value?" value=\"$value\"":' ') .' />';
			$output .=  ' <button class="button" onclick="this.form.searchword.focus();">' . '</button>';

			echo $output;
		?>
		<input type="hidden" name="task" value="search" />
		<input type="hidden" name="option" value="com_search" />
		<input type="hidden" name="Itemid" value="<?php echo $mitemid; ?>" />
	</form>
</div>
