const initializeInspector = function() {

    $(document).keypress(function(event) {

        if (event.which == "105") {
            toggleInspector(document.elementFromPoint(mouse.x, mouse.y));
        } else {
            toggleInspector(false);
        }
    });

    let $i = $("<div></div>");

    $i.addClass("inspector").attr("id","inspector").html("sup brother").appendTo($('body'));

};

const toggleInspector = function($ele) {

    if ($ele === false) {
        $("#inspector").removeClass("inspecting");
        return false;
    }

    let $t = $ele.tagName;
    let $c = $ele.className;
    if ($c == "") {
        $c = "(none)";
    }

    $("#inspector")
        .toggleClass("inspecting")
        .css({
            "top": mouse.y,
            "left": mouse.x
        })
        .html("Object: " +$t+ " / Class: " +$c);

};