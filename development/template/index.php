<?php
<%= banner %>

defined('_JEXEC') or die;

require_once __DIR__.'/classes/core.php';
YooTemplateCore::Init(__DIR__);
YooTemplateCore::$renderer = $this;


$app = JFactory::GetApplication();
$activeMenuItem = $app->getMenu()->getActive();
$isHome = ($activeMenuItem->home=='1');
YooTemplateCore::$jsData->isHome = $isHome;
YooTemplateCore::$jsData->transitionDuration = 1000;

$isAsync = JRequest::GetVar('async',0);

// $my_custom_param = $activeMenuItem->params->get('my_custom_param','default value');

YooTemplateCore::Render();
include 'layouts/index.php';
