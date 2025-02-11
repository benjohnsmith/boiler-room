<?php

$root = $_SERVER['DOCUMENT_ROOT'];

?>

<!DOCTYPE html>
<html>
<head>

    <?php include $root . "/_begin.php"; ?>

    <title>Boiler Plate</title>

</head>
<body>

	<div class="outer-wrapper">

        <div class="banner">
            <div class="inner-wrapper">
                <h1>Styleguide</h1>
                <p>for Ben's Boiler Plate 2025 -- work in progress</p>
            </div>
        </div>

	    <div class="inner-wrapper" id="main-contents">

            <!-- section - typography -->
            <div class="section margin-top-xl">
                <div class="section-toggle curtain-toggle" data-curtain-target="typography">
                    <h4 class="margin-left-lg t-bold">Typography</h4>
                </div>
                <div class="curtain-target closed" data-curtain="typography">
                    <div class="text-block">
                        <div class="">
                            <h1>H1 - Header 1</h1>
                            <h2>H2 - Header 2</h2>
                            <h3>H3 - Header 3</h3>
                            <h4>H4 - Header 4</h4>
                            <h5>H5 - Header 5</h5>
                        </div>
                        <div class="">
                            <h1>H1 - Header 1</h1>
                            <p>Paragraph -- Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                            <h2>H2 - Header 2</h2>
                            <p>Paragraph -- Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
                            <h3>H3 - Header 3</h3>
                            <p>Paragraph -- Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
                            <h4>H4 - Header 4</h4>
                            <p>Paragraph -- Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
                            <h5>H5 - Header 5</h5>
                            <p>Paragraph -- Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
                        </div>
                    </div>
                </div>
            </div>


            <!--<div class="">
                <div class="">
                    <h2 class="">Extender Classes</h2>
                    <div class="">
                        <p class="c-primary">.clear</p>
                        <p>clear: both</p>
                    </div>
                </div>
            </div>-->


    	</div>
    </div>

<?php

include $root . "_end.php";

?>

</body>
</html>