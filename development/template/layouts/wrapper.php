
<?php

defined('_JEXEC') or die;

$app             = JFactory::getApplication();
$doc             = JFactory::getDocument();
$user            = JFactory::getUser();
$templateMode    = $this->params->get('templateMode');
$this->setMetaData('generator','');

JHtml::_('jquery.framework');

// let widgetkit know this template already uses uikit.
// this will tell widgetkit not to load uikit css another time.
JFactory::GetConfig()->set('widgetkit',1);

$doc->addStylesheet('templates/' . $this->template . '/css/widgetkit.css');
$doc->addStylesheet('templates/' . $this->template . '/css/template.css');
$doc->addScript('templates/' . $this->template . '/warp/vendor/uikit/js/uikit.js');
$doc->addScript('templates/' . $this->template . '/js/ylib.js');
$doc->addScript('templates/' . $this->template . '/js/yoogrid.js');
$doc->addScript('templates/' . $this->template . '/js/yoovideo.js');
$doc->addScript('templates/' . $this->template . '/js/template.js');


?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="<?php echo $this->language; ?>" lang="<?php echo $this->language; ?>" dir="<?php echo $this->direction; ?>">
<head>

	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=3.0, user-scalable=yes"/>
	<meta name="HandheldFriendly" content="true" />
	<meta name="apple-mobile-web-app-capable" content="YES" />

	<link href="http://fonts.googleapis.com/css?family=Open+Sans:400" rel="stylesheet" type="text/css">
	<link href="http://fonts.googleapis.com/css?family=Raleway:400" rel="stylesheet" type="text/css">

	<jdoc:include type="head" />

	<script type="text/javascript">
		(function($) {
			window.yooGrid = $.yooGrid(<?php echo YooGrid::ToJson(); ?>);
			window.yooVideo = $.yooVideo({
				endOfIntro:9.0,
				ctrls: {
					introLeft:'33%',
					introTop:'20%',
					videoLeft:'15%',
					videoTop:'20%',
				},
			});
		})(jQuery);
	</script>

</head>

<body class="site <?php if(YooGrid::$hasActiveItem) echo 'detailview'; else echo 'home'; ?>">

	<!-- Header -->
	<?php include 'header.php'; ?>

	<div class="pagewrapper">

		<?php include 'page.php'; ?>

	</div>

	<jdoc:include type="modules" name="debug" style="none" />

	<?php if($templateMode=='default'): ?>
	<?php include 'offcanvas.php'; ?>
	<?php endif; ?>

</body>
</html>
