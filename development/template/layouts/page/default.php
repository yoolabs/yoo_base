<?php

	#$bgimage = YooGrid::$home->params->get('bgimage',false);
	$showSidebar = YTemplate::$renderer->countModules('sidemenu');

?>
    <?php if (YTemplate::$renderer->countModules('top')) : ?>
    <div class="section-top">
        <jdoc:include type="modules" name="top" style="none" />
    </div>
    <?php endif; ?>

<section id="page" class="<?php if($showSidebar) echo 'has-sidebar'; ?>">
    <?php if (YTemplate::$renderer->countModules('content-top')) : ?>
    <div class="section-content-top">
        <jdoc:include type="modules" name="content-top" style="none" />
    </div>
    <?php endif; ?>
	<?php if($showSidebar): ?>
		<div class="sidebar">
			<jdoc:include type="modules" name="sidemenu" style="none" />
		</div>
	<?php endif; ?>
	<div id="main" class="main">
		<jdoc:include type="component" />
	</div>
    <?php if (YTemplate::$renderer->countModules('content-bottom')) : ?>
    <div class="section-content-bottom">
        <jdoc:include type="modules" name="content-bottom" style="none" />
    </div>
    <?php endif; ?>
</section>
<?php if (YTemplate::$renderer->countModules('bottom')) : ?>
<div class="section-bottom">
	<jdoc:include type="modules" name="bottom" style="none" />
</div>
<?php endif; ?>

<jdoc:include type="modules" name="debug" style="none" />
