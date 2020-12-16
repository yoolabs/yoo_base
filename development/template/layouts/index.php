<?php
___phpbanner___;


$app             = JFactory::getApplication();
$doc             = JFactory::getDocument();
$user            = JFactory::getUser();
$renderer        = YTemplate::$renderer;
$templateMode    = $renderer->params->get('templateMode');
$pageClass       = YTemplate::$menuItemParams->get('pageclass_sfx','');
$renderer->setMetaData('generator','');

JHtml::_('jquery.framework');

// let widgetkit know this template already uses uikit.
// this will tell widgetkit not to load uikit css another time.
JFactory::GetConfig()->set('widgetkit',1);

$doc->addStylesheet('templates/' . $renderer->template . '/css/widgetkit.css');
$doc->addStylesheet('templates/' . $renderer->template . '/css/template.css');
$doc->addScript('templates/' . $renderer->template . '/warp/vendor/uikit/js/uikit.js');
// $doc->addScript('templates/' . $renderer->template . '/js/ylib.default.min.js');
// $doc->addScript('templates/' . $renderer->template . '/js/ytemplate.js');
// $doc->addScript('templates/' . $renderer->template . '/js/wi.offcanvas.js');
$doc->addScript('templates/' . $renderer->template . '/js/template.js');


?>

<?php if(!YTemplate::$isAsync): ?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="<?php echo $renderer->language; ?>" lang="<?php echo $renderer->language; ?>" dir="<?php echo $renderer->direction; ?>">
<head>

	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=3.0, user-scalable=yes"/>
	<meta name="HandheldFriendly" content="true" />
	<meta name="apple-mobile-web-app-capable" content="YES" />

	<link href="http://fonts.googleapis.com/css?family=Open+Sans:400" rel="stylesheet" type="text/css">

	<jdoc:include type="head" />

	<script type="text/javascript">
		// (function($) {
		// 	var yTemplate = $.yTemplate({
		// 		ajax : true,
		// 	})
		// })(jQuery);
	</script>

</head>

<body class="site <?php echo $pageClass ?>">

	<!-- Header -->
	<?php echo YTemplate::RenderPartial('header'); ?>

	<div class="pagewrapper">
		<div id="ajaxdock">

<?php endif; ?>


			<?php echo YTemplate::RenderPageInner(); ?>


<?php if(!YTemplate::$isAsync): ?>

		</div>
	</div>

	<?php echo YTemplate::RenderPartial('footer'); ?>

	<?php if($templateMode=='default'): ?>
	<?php echo YTemplate::RenderPartial('offcanvas'); ?>
	<?php endif; ?>

</body>
</html>

<?php endif; ?>
