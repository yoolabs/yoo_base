<?php
___phpbanner___;
JHtml::_('formbehavior.chosen', 'select');
?>

<div class="search<?php echo $this->pageclass_sfx; ?>">

<h1 class="page-title">
	Suchergebnisse
</h1>


<?php #echo $this->loadTemplate('form'); ?>
<?php if ($this->error == null && count($this->results) > 0) :
	echo $this->loadTemplate('results');
else :
	echo $this->loadTemplate('error');
endif; ?>
</div>
