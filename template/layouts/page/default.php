<?php
	$bgimage = YooGrid::$home->params->get('bgimage',false);

?>

<section id="home" class="uk-position-cover">
<div class="item-inner uk-position-absolute">

<div class="item-content uk-cover uk-position-cover " <?php #if($bgimage) echo 'style="background-image:url(\''.$bgimage.'\')"'; ?> >

	<div class="panel-ajax-dock uk-cover uk-position-cover invisible-detailview">
		<!-- <jdoc:include type="component" /> -->
	    <video id="home-video" class=" uk-position-absolute" data-uk-cover poster="/images/video/home/Preview.jpg" width="1820" height="1100">
			<img class="" src="/images/video/home/Preview.jpg" />
	    </video>
	    <div id="home-video-overlay" class=" uk-position-absolute" data-uk-cover width="" height="">
			<img class="uk-invisible" src="/images/video/home/Preview.jpg" />

			<div id="home-video-controls">
				<div><button class="" data-yoovideo-action="play"><i class="uz-icon-play" style="margin-left:2px;"></i></button></div>
				<div><button class="" data-yoovideo-action="pause"><i class="uz-icon-pause"></i></button></div>
				<div><button class="" data-yoovideo-action="repeat"><i class="uz-icon-replay"></i></button></div>
			</div>
	    </div>
		<div class="uk-container uk-container-center">

		</div>
	</div>

	<div id="uz-impressum-link">
		<a href="{{wi_var:url_impressum}}" target="_blank">Impressum</a>
		<a id="created-by-yoolabs" target="_blank" href="http://yoolabs.com" >
			<img src="{{wi_var:url_sp}}/images/created_by_yoolabs.svg" alt="Created by YOOlabs GmbH" width="100" />
		</a>
	</div>

</div>

</div>
</section>
