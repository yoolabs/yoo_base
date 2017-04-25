<?php
<%= banner %>


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
$doc->addScript('templates/' . $this->template . '/js/ylib.default.min.js');
$doc->addScript('templates/' . $this->template . '/js/yootemplate.js');
$doc->addScript('templates/' . $this->template . '/js/template.js');


?>

<?php if(!$isAsync): ?>
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
			var yooTemplate = $.yooTemplate({
				ajax : true,
			})
		})(jQuery);
	</script>

</head>

<body class="site">

	<!-- Header -->
	<?php echo YooTemplateCore::RenderPartial('header'); ?>

	<div class="pagewrapper">
		<div id="ajaxdock">

<?php endif; ?>


			<?php echo YooTemplateCore::RenderPage(); ?>


<?php if(!$isAsync): ?>

		</div>
	</div>

	<?php echo YooTemplateCore::RenderPartial('footer'); ?>

	<?php if($templateMode=='default'): ?>
	<?php echo YooTemplateCore::RenderPartial('offcanvas'); ?>
	<?php endif; ?>

</body>
</html>

<?php endif; ?>
