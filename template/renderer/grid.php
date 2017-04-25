<?php

defined('JPATH_PLATFORM') or die;

require_once 'gridhelper.php';

class YooGrid
{

	static $initialized = false;
	static $list;
	static $base;
	static $active;
	static $home;
	static $jsSetup;
	static $hasActiveItem = false;
	static $activeItemContent;
	static $homeContent;

	static function init()
	{

		if(self::$initialized) return;
		self::$initialized = true;

		$params = new JRegistry();
		$params->set('startLevel',0);
		$params->set('endLevel',0);
		$params->set('showAllChildren',1);
		$params->set('menutype','mainmenu');
		$params->set('base',0);

		self::$jsSetup   = new StdClass();

		self::$list      = YooGridHelper::getList($params);
		self::$base      = YooGridHelper::getBase($params);
		self::$active    = YooGridHelper::getActive($params);
		self::$home      = YooGridHelper::getHome($params);

		self::processData();

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

	static function processData()
	{
		self::$jsSetup->activeId = self::$active->id;
		self::$jsSetup->items = array();
		self::$jsSetup->siteName = JFactory::getConfig()->get('sitename','');;
		foreach(self::$list as $i=>$item) {
			$jsitem = new StdClass();
			$jsitem->id = $item->id;
			$jsitem->alias = $item->alias;
			$jsitem->isActive = ($item->id==self::$active->id);
			$jsitem->theme = $item->params->get('itemcolor','grey');
			$jsitem->bgImage = $item->params->get('bgimage','');
			$jsitem->route = $item->route;
			$jsitem->title = $item->params->get('uz_headline',$item->title);
			$jsitem->col = ($i) % 3;
			$jsitem->row = floor(($i) / 3);
			self::$jsSetup->items[] = $jsitem;
		}

		if(self::$active->id && !self::$jsSetup->isHome) {
			// render grid in detailview mode
			$activeItem = false;
			foreach(self::$jsSetup->items as $i=>$item) {
				if($item->isActive) $activeItem = $item;
			}
			if($activeItem) {
				self::$hasActiveItem = true;
			}
		}
	}

	static function toJson()
	{
		return json_encode(self::$jsSetup,JSON_PRETTY_PRINT);
	}

	static function Render()
	{
		echo self::RenderHomeItem(self::$homeContent);
		?>

		<div id="wrapper-grid">
			<div id="grid" >
				<div class="grid-dock">
					<?php echo self::RenderHtmlGrid(); ?>
				</div>
			</div>
		</div>

		<?php
	}

	static function RenderHtmlGrid()
	{

		if(self::$hasActiveItem) {
			// render grid in detailview mode
			$activeItem = false;
			foreach(self::$jsSetup->items as $i=>$item) {
				if($item->isActive) $activeItem = $item;
			}
			$offsetX = $activeItem->col * -100;
			$offsetY = $activeItem->row * -100;
			$_transform = 'transform:translate3d('.$offsetX.'vw,'.$offsetY.'vh,0) scale(1)';
			$transform = "-webkit-$_transform; -moz-$_transform; $_transform; ";
			$out =  '<div class="yoo-grid-menu uk-clearfix detailview" style="'.$transform.'" >'."\n";
		} else {
			// render grid in overview mode
			$out =  '<div class="yoo-grid-menu uk-clearfix" >'."\n";
		}

		foreach(self::$jsSetup->items as $i=>$item) {
			$out .=  self::RenderGridItem($item);
		}
		$out .= '</div>'."\n";

		return $out;

	}

	static function RenderGridItem($item,$content=false)
	{

		$out .=  '<section class="yoo-grid-item item-theme-'.$item->theme.' '.($item->isActive ? 'focused':'').'" data-item-id="'.$item->id.'" data-item-alias="'.$item->alias.'">';
		$out .=  '<div class="item-inner">';

		$out .=  '<a class="item-link hidden-detailview flex" href="'. JURI::Base().$item->route .'" data-item-id="'.$item->id.'" data-item-alias="'.$item->alias.'">';
		$out .=  '<h2 class="item-title">'.$item->title.'</h2>';
		$out .=  '</a>';

		$out .=  '<div class="item-content hidden-overview"' .($item->bgImage ? 'style="background-image:url(\''.$item->bgImage.'\')"':''). ' >';
		$out .=  '<div class="panel-ajax-dock">';
		$out .=  $item->isActive ? self::$activeItemContent : '';
		$out .=  '</div>';
		$out .=  '</div>';

		$out .=  '</div>';
		$out .=  '</section>';
		$out .=  "\n";

		return $out;

	}

	static function RenderHomeItem($content)
	{

		return $content;
	}






}
