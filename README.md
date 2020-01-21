# YOObase template

YOO Base template is a starting point for developing joomla templates with an advanced base toolset.

## Usage

### Installation

If you choose to use YOObase bundled with customjoomla package, everything is preconfigurated correctly.
Check [YOObase releases page](https://github.com/yoolabs/yoo_base/releases) to download customjoomla.

If you installed YOObase manually, make sure to also install these extensions and configurate them as needed:

* [Customized LESS compiler plugin](https://github.com/jbjhjm/plg_system_less) 
* [WI Menuitem Params](https://github.com/jbjhjm/wi_menuitem_params)
* [WI TinyMCE config](https://github.com/jbjhjm/yoo_tinymce_config)

### Template structure

* _classes_ - source code
* _css_ - don't touch, compiled less files. Only tinymce.json should be edited to set styles for admin WYSIWYG editor.
* _fonts_ - put required web fonts in here
* _html_ - regular joomla template folder to provide layout overrides
* _images_ - put images here
* _js_ - contains a set of standard JS libraries. Put custom javascripts here.
* _layout_ - main layout/template files generating the output html. [Read More](#layout)
* _less_ - less css files. Create theme styles here. [Read More](#less)
* _less\_yootheme_ - alternative less start files. 
* _renderer_ - custom module renderers [Read More](#renderer)

### Layout

YOObase provides basic layout system made out of one or several page layouts and partial, reusable layouts (e.g. header, footer, offcanvas menu).

__layouts/index.php__
Add custom scripts and stylesheets as well as custom html head data here.
Loads one of the layouts in layouts/page by calling `<?php echo YTemplate::RenderPageInner(); ?>`.

__layouts/page/...__
Page layouts. By default, default.php will be loaded. 
To use a different page layout, add a menu item parameter named `wi_page_layout`. 
Its value will be used to load a different page layout file.
Example: Set `wi_page_layout = onepage` to let the menuitem render using onepage.php.
Note: To specify custom menu item params, use the [WI Menuitem Params](https://github.com/jbjhjm/wi_menuitem_params) plugin.

__layouts/partial/...__
Partial templates can be loaded from page layouts by using `<?php echo YTemplate::RenderPartial('header'); ?>`.

### Less

__less/typo.less__
Specify text styles here but no page layouts. These styles will also be loaded into admin WYSIWYG editor.

__less/template.less__
Add your template styles here. Some basic styles are set by default. Imports [UIkit v2 (see manual here)](https://getuikit.com/v2/docs/core.html) by default.
Default responsiveness breakpoints are: 480px, 768px, 960px, 1200px

__less/custom/...__
Contains various less mixins:

* _link-styles.less_ - style elements with animated underline
* _menutoggle.less_ - create style for an animated menu icon.
* _prefixer.less_ - mixins adding vendor-prefixes to modern css properties (e.g. -moz-..., -webkit-...)
* _scrollbar.less_ - customize scrollbar styling 
* _uikit2-custom.less_ - extends uikit grid/width with xsmall (360-479px) and xlarge (1220+ px) classes
* _wi.snapscroll.less_ - import if you use onepage layout. Import script js/wi.snapscroll.js, too.

### Renderer

__ymodulesgrid__
Added as a replacement to yootheme's module grid system, ymodulesgrid can be used to render modules in grid layouts.

Use following attributes to specify the rendered layout:

* _small="1"_ - smaller grid spacing on mobile devices
* _match="..." - value "1" - auto match column height. provide a css class (typically .uk-panel) to set matched height on subelements.
* _cols_ - specify column count for various page sizes (cols, cols-small, cols-medium, cols-large, cols-xlarge). 

__Example:__

```html
<jdoc:include type="yoomodulesgrid" name="[moduleposition]" style="xhtml" cols-medium="2" cols-large="4" />
```

The example would render a grid displaying 1 column on mobiles, 2 on medium devices and 4 on large devices.

## Building

Make sure [NodeJS](https://nodejs.org/en/download/) is installed, then download or clone the repository: 
`git clone https://github.com/jbjhjm/yoo_base.git`

Change to development directory and run `npm install`.

Use `grunt build` to create a installer package.
Use `grunt stage` or `grunt watch:stage` to copy files to a local joomla installation (default path is ../staging/).
