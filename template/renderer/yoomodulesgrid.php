<?php
/**
 * @package     Joomla.Platform
 * @subpackage  Document
 *
 * @copyright   Copyright (C) 2005 - 2015 Open Source Matters, Inc. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE
 */

defined('JPATH_PLATFORM') or die;

/**
 * JDocument Modules renderer
 *
 * @since  11.1
 */
class JDocumentRendererYooModulesGrid extends JDocumentRenderer
{
	/**
	 * Renders multiple modules script and returns the results as a string
	 *
	 * @param   string  $position  The position of the modules to render
	 * @param   array   $params    Associative array of values
	 * @param   string  $content   Module content
	 *
	 * @return  string  The output of the script
	 *
	 * @since   11.1
	 */
	public function render($position, $params = array(), $content = null)
	{
		$renderer = $this->_doc->loadRenderer('module');
		$buffer = '';

		$app = JFactory::getApplication();
		$user = JFactory::getUser();
		$frontediting = ($app->isSite() && $app->get('frontediting', 1) && !$user->guest);

		$menusEditing = ($app->get('frontediting', 1) == 2) && $user->authorise('core.edit', 'com_menus');

		$modules = JModuleHelper::getModules($position);
		$modulecount = count($modules);

		$cols=array();
		$cols['width'] = 		($params['cols']) 			? (int)$params['cols'] 			: 1;
		$cols['width-small'] = 	($params['cols-small']) 	? (int)$params['cols-small'] 	: 2;
		$cols['width-medium'] = ($params['cols-medium']) 	? (int)$params['cols-medium'] 	: false;
		$cols['width-large'] = 	($params['cols-large']) 	? (int)$params['cols-large'] 	: 4;
		$cols['width-xlarge'] = ($params['cols-xlarge']) 	? (int)$params['cols-xlarge'] 	: false;

		if($modulecount==3) $cols['width-large'] = 3;


		foreach($cols as &$col) {
			if($col>$modulecount) $col = $modulecount;
		}

		$colclasses = '';

		foreach($cols as $id=>$count) {
			if($count!=false) $colclasses.= ' uk-'.$id.'-1-'.$count;
		}

		foreach ($modules as $i=>$mod)
		{
			$mod->index = $i;
			$moduleHtml = $renderer->render($mod, $params, $content);

			if ($frontediting && trim($moduleHtml) != '' && $user->authorise('module.edit.frontend', 'com_modules.module.' . $mod->id))
			{
				$displayData = array('moduleHtml' => &$moduleHtml, 'module' => $mod, 'position' => $position, 'menusediting' => $menusEditing);
				JLayoutHelper::render('joomla.edit.frontediting_modules', $displayData);
			}

			$buffer .= "<div class=\"$colclasses\" >\n$moduleHtml\n</div>";
		}

		$gridclasses = 'uk-grid uk-grid-small-small';
		if($params['small']) $gridclasses.= ' uk-grid-small';

		if($params['matchheight']=='0'||!$params['matchheight']) $matchheight = '' ;
		elseif ($params['matchheight']=='panel') $matchheight = 'data-uk-grid-match="{target:\'.uk-panel\'}"';
		else $matchheight =  'data-uk-grid-match';

		$buffer = "<div class=\"$gridclasses\" $matchheight data-uk-grid-margin >\n$buffer\n</div>";

		return $buffer;
	}
}
