	<?php if (YTemplate::$renderer->countModules('offcanvas')) : ?>
	<div id="offcanvas" class="uk-offcanvas">
		<div class="uk-offcanvas-bar">
				<jdoc:include type="modules" name="offcanvas" style="none" />
		</div>
	</div>
	<?php endif; ?>
