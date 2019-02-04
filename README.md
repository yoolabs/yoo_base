# YOO Base template

YOO Base template is a starting point for developing joomla templates with advanced functionality.
It contains several useful features and tools to give your template more features and power.

It's recommended to use it together with ...
* [LESS compiler plugin](https://github.com/jbjhjm/plg_system_less) 
* [WI Menuitem Params](https://github.com/jbjhjm/wi_menuitem_params)
* [WI TinyMCE config](https://github.com/jbjhjm/yoo_tinymce_config)

Features:
* LESS System _requires LESS compiler plugin_
  * Using UIkit 2 with extended styles
  * Several Less mixins providing styled links, animated menutoggles, scrollbars, prefixer and such
  * _requires WI TinyMCE config_ generate a tinyMCE editor stylesheet for improved text preview (compile typo.less -> tinymce.css)
* page layout split into partials located in layouts folder
* snapscroll support included
* _requires WI TinyMCE config_ add css/tinymce.json file to let users choose text styles specific to this template
* YooModulesGrid renderer to render a module position using UIkit Grid

# Building
Make sure [NodeJS](https://nodejs.org/en/download/) is installed, then download or clone the repository: 
`git clone https://github.com/jbjhjm/yoo_base.git`

Change to development directory and run `npm install`.

Use `grunt build` to create a installer package.
Use `grunt stage` or `grunt watch:stage` to copy files to a local joomla installation (default path is ../staging/).
