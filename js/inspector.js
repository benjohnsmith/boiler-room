const inspectorMessages = {
    ".curtain-toggle": "",
    ".curtain-target": ""
};

const initializeInspector = function() {

    $(document).keypress(function(event) {
        if (event.which == "105") {
            let ele = document.elementFromPoint(mouse.x - window.scrollX, mouse.y - window.scrollY);
            if (ele !== null) {
                inspect(ele);
            }
        } else {
            removeInspector();
        }
    });

};

const inspect = function($ele) {

    removeInspector();
    if ($ele === false) {
        return false;
    }

    let $i = $("<div></div>");
    $i.addClass("inspector light-dismiss").attr("id","inspector").appendTo($('body'));

    let $line1 = $("<p></p>").addClass("i-block i-tags").appendTo($i);
    let $line2 = $("<p></p>").addClass("i-block i-classes").appendTo($i);
    let $line3 = $("<p></p>").addClass("i-block i-extra").appendTo($i);

    let $t = $ele.tagName;
    let $c = $ele.className + "";
    $c = $c.split(" ");

    let $tag = $("<span></span>");
    $tag.addClass("i-tag").text("<" + $t + ">").appendTo($line1);

    if ($c.length == 0 || $c[0] == "") {
        $c = "(none)";
        let $class = $("<span></span>");
        $class.addClass("i-class").text($c).appendTo($line2);
    } else {
        $.each($c, function(i) {
            let $class = $("<span></span>");
            $class.addClass("i-class").text("." +$c[i]).appendTo($line2);
        });
    }

    // position the inspector
    let s = window.scrollTop;
    console.log(s);
    $i.css({
        "top": mouse.y,
        "left": mouse.x
    });

};

const removeInspector = function() {
    $(".inspector").remove();
};