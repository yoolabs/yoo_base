<?php

defined('JPATH_PLATFORM') or die;

require_once __DIR__.'/helper.php';

class YooTemplateCore
{

	static $initialized = false;
	static $layoutPath;
	static $isAsync;
	static $list;
	static $base;
	static $active;
	static $home;
	static $jsData;
	static $hasActiveItem = false;
	static $activeItemContent;
	static $homeContent;

	static function init($basePath)
	{

		if(self::$initialized) return;
		self::$initialized = true;
		self::$basePath = $basePath.'/';
		self::$layoutPath = $basePath.'/layouts/';
		self::$isAsync = JRequest::GetVar('async',0);

		$params = new JRegistry();
		$params->set('startLevel',0);
		$params->set('endLevel',0);
		$params->set('showAllChildren',1);
		$params->set('menutype','mainmenu');
		$params->set('base',0);

		self::$jsData   = new StdClass();

		self::$list      = YooTemplateHelper::getList($params);
		self::$base      = YooTemplateHelper::getBase($params);
		self::$active    = YooTemplateHelper::getActive($params);
		self::$home      = YooTemplateHelper::getHome($params);

		// self::prepareJsData();

		$active_id = $active->id;
		$path      = $base->tree;

	}

	static function setData($menudata)
	{


	}

	static function setItemContent($content)
	{
		self::$activeItemContent = $content;
	}

	static function SetHomeContent($content)
	{
		self::$homeContent = $content;
	}

	static function prepareJsData()
	{
		self::$jsData->activeId = self::$active->id;
		self::$jsData->items = array();
		self::$jsData->siteName = JFactory::getConfig()->get('sitename','');;
		foreach(self::$list as $i=>$item) {
			$jsitem = new StdClass();
			$jsitem->id = $item->id;
			$jsitem->alias = $item->alias;
			$jsitem->isActive = ($item->id==self::$active->id);
			$jsitem->route = $item->route;
			// $jsitem->theme = $item->params->get('itemcolor','grey');
			// $jsitem->bgImage = $item->params->get('bgimage','');
			// $jsitem->title = $item->params->get('uz_headline',$item->title);
			self::$jsData->items[] = $jsitem;
		}

		if(self::$active->id && !self::$jsData->isHome) {
			// render grid in detailview mode
			$activeItem = false;
			foreach(self::$jsData->items as $i=>$item) {
				if($item->isActive) $activeItem = $item;
			}
			if($activeItem) {
				self::$hasActiveItem = true;
			}
		}
	}

	static function toJson()
	{
		return json_encode(self::$jsData,JSON_PRETTY_PRINT);
	}

	static function Render()
	{
		if(self::$isAsync) {
			include self::$layoutPath.'index.php';
		} else {
			echo self::RenderPage();
		}
	}

	static function RenderPage()
	{
		ob_start();
		$id = 'default';
		include self::$layoutPath.'page/'.$id.'.php';
		$html = ob_get_clean();
		return '<div yoo-template-page class="yoo-template-page-'.$id.'">'.$html.'</div>';
	}

	static function RenderPartial($id)
	{
		ob_start();
		include self::$layoutPath.'partial/'.$id.'.php';
		$html = ob_get_clean();
		return $html;
	}

	// static function Render()
	// {
	// 	echo self::RenderHomeItem(self::$homeContent);
	//
	//
	// 	<div id="wrapper-grid">
	// 		<div id="grid" >
	// 			<div class="grid-dock">
	// 				 echo self::RenderHtmlGrid();
	// 			</div>
	// 		</div>
	// 	</div>
	//
	//
	// }




}
