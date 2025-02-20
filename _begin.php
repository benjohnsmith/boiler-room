<?php

//
//  These versions allow for a manual cache refresh
//  CSS and JS are only caches necessary at the moment
//
$css_version = "1.212";
$js_version = "1.211";

?>

<!--


    C R E D I T S


-->

<!--global page metadata-->
<meta name="title" property="og:title" content="Boiler Plate">
<meta name="description" property="og:description" content="A document for copying and pasting to create new blank sites">
<meta name="keywords" content="Boilerplate">
<meta name="author" content="benjohnsmith.com">
<meta charset="UTF-8">

<!--prevent scaling on mobile devices-->
<meta name="viewport" content="user-scalable=no, initial-scale=0.8">

<!--fb page metadata-->
<meta property="og:url" content="http://benjohnsmith.com">
<meta property="og:type" content="website">
<meta property="og:image" content="/assets/favicon/favicon_original.png">

<!--favicon-->
<link rel="apple-touch-icon" sizes="180x180" href="/assets/favicon/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/assets/favicon/favicon-16x16.png">
<link rel="manifest" href="/assets/favicon/manifest.json">
<link rel="mask-icon" href="/assets/favicon/safari-pinned-tab.svg" color="#ffffff">
<link rel="shortcut icon" href="/assets/favicon/favicon.ico">
<meta name="msapplication-config" content="/favicon/browserconfig.xml">
<meta name="theme-color" content="#ffffff">

<!--links to external styles-->
<link rel="stylesheet" type="text/css" href="/css/default.css?v=<?=$css_version?>">

<!--links to plugins-->
<script src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>

<!--homegrown scripts-->
<script type="text/javascript" src="/js/util.js?v=<?=$js_version?>"></script>
<script type="text/javascript" src="/js/global.js?v=<?=$js_version?>"></script>
<script type="text/javascript" src="/js/inspector.js?v=<?=$js_version?>"></script>