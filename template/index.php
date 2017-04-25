
<?php

defined('_JEXEC') or die;
require_once __DIR__.'/renderer/yoomodulesgrid.php';

$app             = JFactory::getApplication();
$doc             = JFactory::getDocument();
$user            = JFactory::getUser();
$templateMode    = $this->params->get('templateMode');
$this->setMetaData('generator','');

JHtml::_('jquery.framework');
#JHtml::_('bootstrap.framework');

// let widgetkit know this template already uses uikit.
// this will tell widgetkit not to load uikit css another time.
JFactory::GetConfig()->set('widgetkit',1);

$doc->addStylesheet('templates/' . $this->template . '/css/widgetkit.css');
$doc->addStylesheet('templates/' . $this->template . '/css/template.css');
$doc->addScript('templates/' . $this->template . '/js/template.js');
$doc->addScript('templates/' . $this->template . '/warp/vendor/uikit/js/uikit.js');

// custom menuitem params integration
// $activeMenuItem = $app->getMenu()->getActive();
// $my_custom_param = $activeMenuItem->params->get('my_custom_param','default value');


?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="<?php echo $this->language; ?>" lang="<?php echo $this->language; ?>" dir="<?php echo $this->direction; ?>">
<head>

	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=3.0, user-scalable=yes"/>
	<meta name="HandheldFriendly" content="true" />
	<meta name="apple-mobile-web-app-capable" content="YES" />

	<jdoc:include type="head" />

</head>

<body class="site ">

	<!-- Body -->
	<div class="pagewrapper">

		<div class="uk-container uk-container-center contentarea">

			<!-- Header -->
			<header class="header" id="header" role="banner">
				<div class="header-inner clearfix">

					<div class="uk-clearfix">

						<a class="brand uk-float-left" id="logo" href="<?php echo $this->baseurl; ?>">
							<jdoc:include type="modules" name="logo" style="none" />
						</a>

						<div class="uk-float-right uk-hidden-small" id="topmenu">
							<jdoc:include type="modules" name="topmenu" style="none" />
						</div>

						<?php if ($this->countModules('offcanvas')) : ?>
						<a href="#offcanvas" class="uk-navbar-toggle uk-visible-small" data-uk-offcanvas></a>
						<?php endif; ?>

					</div>

					<div class="uk-hidden-small" id="menu">
						<jdoc:include type="modules" name="nav" style="none" />
					</div>


				</div>
			</header>

			<div id="wrapper-main">

				<main id="main" role="main" class="<?php echo $span; ?>">

					<!-- Begin Content -->

						<jdoc:include type="modules" name="content-top" style="none" />
						<jdoc:include type="component" />
						<jdoc:include type="modules" name="content-bottom" style="none" />

					<!-- End Content -->

				</main>

			</div>

			<!-- Footer -->
			<footer class="footer contentarea" id="footer" role="contentinfo">
				<div class="uk-container uk-container-center">

					<jdoc:include type="modules" name="footer" style="none" />

				</div>
			</footer>

		</div>

	</div>

	<jdoc:include type="modules" name="debug" style="none" />

	<?php if($templateMode=='default'): ?>
	<?php if ($this->countModules('offcanvas')) : ?>
	<div id="offcanvas" class="uk-offcanvas">
		<div class="uk-offcanvas-bar">
				<jdoc:include type="modules" name="offcanvas" style="none" />
		</div>
	</div>
	<?php endif; ?>
	<?php endif; ?>

</body>
</html>
