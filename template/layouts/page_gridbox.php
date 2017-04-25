<!-- <jdoc:include type="component" /> -->

<?php
	jimport( 'joomla.application.module.helper' );

	$app = JFactory::getApplication();
	$user = JFactory::getUser();

	$renderer = JFactory::GetDocument()->loadRenderer('module');
	$params = YooGrid::$active->params;
	$pageTitle = YooGrid::$active->title;
	$panelTitle = $params->get('headline','');
	$titleColorClass = 'color-'.$params->get('headlinecolor','grey');

	$frontediting = ($app->isSite() && $app->get('frontediting', 1) && !$user->guest);
	$menusEditing = ($app->get('frontediting', 1) == 2) && $user->authorise('core.edit', 'com_menus');

	$footerModules = JModuleHelper::getModules('panel-footer');
	$introModules = JModuleHelper::getModules('panel-intro');


	########## RENDER MAIN MODULES ###########################################################################################################################

	$mainModules = JModuleHelper::getModules('panel-main');
	$mainModulesBuffer = array();
	$mainModulesLayout = (array)$params->get('box_layout',array());

	if(count($mainModules)>3){
		for($i=0;$i<count($mainModules);$i++)
			$mainModulesClasses[] = 'uk-width-medium-1-2 uk-width-xlarge-1-4';
	}elseif(count($mainModules)==3){
		$mainModulesClasses[] = 'uk-width-medium-1-2 uk-width-large-1-3';
		$mainModulesClasses[] = 'uk-width-medium-1-2 uk-width-large-1-3';
		$mainModulesClasses[] = 'uk-width-medium-1-1 uk-width-large-1-3';
	}elseif(count($mainModules)==2){
		$mainModulesClasses[] = 'uk-width-medium-1-2';
		$mainModulesClasses[] = 'uk-width-medium-1-2';
	}else{
		$mainModulesClasses[] = 'uk-width-1-1';
	}
	foreach ($mainModules as $i=>$mod)
	{
		$moduleHtml = $renderer->render($mod, array());

		if ($frontediting && trim($moduleHtml) != '' && $user->authorise('module.edit.frontend', 'com_modules.module.' . $mod->id))
		{
			$displayData = array('moduleHtml' => &$moduleHtml, 'module' => $mod, 'position' => 'panel-main', 'menusediting' => $menusEditing);
			JLayoutHelper::render('joomla.edit.frontediting_modules', $displayData);
		}

		$mainModulesBuffer[] = '<div class="'.$mainModulesClasses[$i].'"><div class="uk-panel style-'.(@$mainModulesLayout[$i]?$mainModulesLayout[$i]:'white').'">'."\n".$moduleHtml."\n".'</div></div>';
	}

	$mainModulesBuffer = implode("\n",$mainModulesBuffer);
	$mainModulesBuffer = '<div class="uk-grid maingrid" data-uk-grid-margin data-uk-grid-match="{target:\'.uk-panel\'}">'.$mainModulesBuffer.'</div>';


?>

<div class="panel-wrapper">
	<div class="content-wrapper">
		<div class="uk-container uk-container-center">
			<div class="titlewrapper <?php echo $titleColorClass ?>">
				<h2 class="pagetitle"><?php echo $pageTitle ?></h2>
				<h1 class="pagesubtitle"><?php echo $panelTitle ?></h1>
			</div>
			<div class="panel-intro uk-margin">
				<jdoc:include type="modules" name="panel-intro" style="blank" />
			</div>
			<?php echo $mainModulesBuffer; ?>
		</div>
	</div>
	<?php if(count($footerModules)): ?>
	<div class="footer-bar">
		<div class="uk-container uk-container-center">
			<jdoc:include type="modules" name="panel-footer" style="blank" />
		</div>
	</div>
	<?php endif; ?>
</div>
