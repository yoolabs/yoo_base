<?php
<%= banner %>


	// $bgimage = YooTemplateCore::$home->params->get('bgimage',false);

	JFactory::getDocument()->addScript('templates/' . YooTemplateCore::$renderer->template . '/js/jquery.onepage-scroll.js');

?>
<div class="onepage-wrapper">
    <?php if (YooTemplateCore::$renderer->countModules('onepage')) : ?>
    <!-- <div id="tm-fullscreen-b2" class="tm-fullscreen tm-fullscreen-b2"> -->
        <jdoc:include type="modules" name="onepage" style="none" />
    <!-- </div> -->
    <?php endif; ?>
</div>

    <?php if (YooTemplateCore::$renderer->countModules('dotnav')) : ?>


    <?php endif; ?>

    <div id="dotnav-dock">
	    <div id="dotnav-inner"></div>
	    <div id="dotnav-bottom">
		    <?php if (YooTemplateCore::$renderer->countModules('dotnav-bottom')) : ?>
		    <jdoc:include type="modules" name="dotnav-bottom" style="none" />
		    <?php endif; ?>
		</div>
	</div>


<jdoc:include type="modules" name="debug" style="none" />
