<?php
___phpbanner___;
?>

<?php if ($this->error) : ?>
<div class="error">
			<?php echo $this->escape($this->error); ?>
</div>
<?php endif; ?>
