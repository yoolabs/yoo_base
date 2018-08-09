<?php
<%= banner %>

defined('_JEXEC') or die;

require_once __DIR__.'/renderer/ymodulesgrid.php';
require_once __DIR__.'/classes/ytemplate.php';
YTemplate::Init(__DIR__);
YTemplate::$renderer = $this;


$app = JFactory::GetApplication();
$activeMenuItem = $app->getMenu()->getActive();
$isHome = ($activeMenuItem->home=='1');
YTemplate::$jsData->isHome = $isHome;
YTemplate::$jsData->transitionDuration = 1000;

$isAsync = JRequest::GetVar('async',0);

// $my_custom_param = $activeMenuItem->params->get('my_custom_param','default value');

echo YTemplate::Render();
