<?php
___phpbanner___;

if ($this->params->get('show_advanced', 1) || $this->params->get('show_autosuggest', 1))
{
	JHtml::_('jquery.framework');

	$script = "
jQuery(function() {
	var form = jQuery('#finder-search')";
	if ($this->params->get('show_advanced', 1))
	{
		/*
		* This segment of code disables select boxes that have no value when the
		* form is submitted so that the URL doesn't get blown up with null values.
		*/
		$script .= "
	form.on('submit', function(e){
		e.stopPropagation();
		// Disable select boxes with no value selected.
		jQuery('#advancedSearch').find('select').each(function(index, el) {
			var el = jQuery(el);
			if(!el.val()){
				el.attr('disabled', 'disabled');
			}
		});
	});";

	$script .= "
	form.on('change', 'select', function(e){
		form.submit();
	});";
	}

	$script .= "
});";

	JFactory::getDocument()->addScriptDeclaration($script);
}
?>

<form id="finder-search" action="<?php echo JRoute::_($this->query->toUri()); ?>" method="get" class="uk-clearfix">
	<?php echo $this->getFields(); ?>

	<?php
	/*
	 * DISABLED UNTIL WEIRD VALUES CAN BE TRACKED DOWN.
	 */
	if (false && $this->state->get('list.ordering') !== 'relevance_dsc') : ?>
		<input type="hidden" name="o" value="<?php echo $this->escape($this->state->get('list.ordering')); ?>" />
	<?php endif; ?>

	<input type="hidden" name="q" id="q" size="30" value="<?php echo $this->escape($this->query->input); ?>" class="inputbox" />

	<?php if ($this->params->get('show_advanced', 1)) : ?>
		<div id="advancedSearch" class="collapse<?php if ($this->params->get('expand_advanced', 0)) echo ' in'?>">
			<?php if ($this->params->get('show_advanced_tips', 1)) : ?>
				<div class="advanced-search-tip">
					<?php echo JText::_('COM_FINDER_ADVANCED_TIPS'); ?>
				</div>
			<?php endif; ?>
			<div id="finder-filter-window" class="uk-clearfix">
				<?php echo JHtml::_('filter.select', $this->query, $this->params); ?>
			</div>
		</div>
	<?php endif; ?>
</form>
