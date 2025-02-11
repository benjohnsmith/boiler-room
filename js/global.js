/////////////////////////////////////////////////
//                                             //
//    G L O B A L   C O N T R O L S            //
//                                             //
/////////////////////////////////////////////////


//
//  INITIALIZE CONTROLS
//
//  call this function when a ui container has just been drawn
//  (this includes display:hidden -> display:block, etc.)
//  so that the controls work as expected
//
//      EXAMPLE:
//
//      This can be called simply as initializeControls()
//      or it can be provided a scope from the DOM
//      e.g. initializeControls($('body'))
//
//
const initializeControls = function($ele) {

    // set document as root if no scope is defined
    $ele = dp($ele, $(document));

    /*console.log("controls initialized within:");
    console.log($ele);*/

    // find controls that have max-height animations
    // give them their data values needed for the animation
    calculateSize($ele);

    // iterate through custom controls and give them their listeners
    initializeCurtains($ele);
    initializeModals($ele);
    initializeTabs($ele);
    initializePopups($ele);
    initializeInfoNodes($ele);

    // prevent hashlink scrolltop
    preventHashLink($ele);

};

//
//  PREVENT HASH # LINK
//
//  this simple utility prevents the window from being
//  scrolled to the top when anchor links are navigated
//
const preventHashLink = function($ele) {
    $ele = dp($ele, $(document));
    $ele.find("a[href='#']").each(function() {

        let $e = $(this);
        if (!$e.data('init-click')) {
            $e.on("click", function (e) {
                e.preventDefault();
            });
            $e.data('init-click', true);
        }

    });
};

//
//  CALCULATE SIZE
//
//  iterate through specifically tagged objects and gather their height requirements
//  this works even if objects are hidden, but must be loaded first.
//
//  Note the types of objects that need to store their height data are used
//  in the various functions below.
//
const calculateSize = function($ele) {

    // set document as root if no scope is defined
    $ele = dp($ele, $(document));

    // iterate on tagged objects
    $ele.find('.curtain-target, .accordion-list .li-content, .fragment-project .tweener').each(function() {

        let $e = $(this);
        let h = $e.children();

        // return if there are no children in the container
        if (h.length <= 0)
            return;
        let ht = 0;

        // add the height [h] of each child to the stored variable [ht]
        h.each(function() {
            ht += $(this).outerHeight(true);
        });
        $e.attr('data-contents-height',ht);

    });

};


//////////////////////////////////////////////////////////////////
//                                                              //
//    C U R T A I N S                                           //
//                                                              //
//    When clicked, a curtain-toggle will turn off a series     //
//    of related UI elements (curtain-group) and turn on a      //
//    single curtain-toggle container.                          //
//                                                              //
//    This function is accompanied by a size animation          //
//    transition.                                               //
//                                                              //
//////////////////////////////////////////////////////////////////

//
//  INITIALIZE CURTAINS
//
//  to use curtains
//    create a ui element with class .curtain-toggle <-- this is your action button
//    give it an id (e.g. 'my-toggle')
//    give it a custom attribute: data-curtain-target='curtain-1`
//    create a series of hide-able elements
//      give them unique ids (e.g. 'curtain-1') <-- match toggle custom attribute
//      give them .curtain-target
//      give them custom attribute: data-curtain-group='group name' <-- make them mutually exclusive
//      give them custom attribute: data-curtain='my-toggle' <-- match id of toggle
//      give them .closed if you want them to start collapsed
//
//  now run initializeCurtains() or initializeControls()
//
//
//      TIPS
//      - don't put any padding no the curtain-target
//
//
const initializeCurtains = function($ele) {

    $ele = dp($ele, $(document));

    // set max height initially
    $ele.find('.curtain-target').each(function() {

        let $e = $(this);

        let h = parseInt($e.attr('data-contents-height'));
        if ($e.hasClass('closed')) {
            $e.css('max-height','0');
        } else {
            $e.css('max-height', h+'px');
        }

        // listeners
        if (!$e.data('init-listeners')) {
            $e.on("open", function () {
                // var h = $e.attr("data-contents-height");
                let ht = 0;
                $(this).children().each(function() {
                    ht += $(this).outerHeight(true);
                });
                $e.attr('data-contents-height',ht);
                $e.css("max-height", h+"px");
                $e.removeClass("closed");
            }).on("close", function() {
                $e.css("max-height", "0");
                $e.addClass("closed");
            });
            $e.data('init-listeners', true);
        }

    });

    $ele.find(".curtain-toggle").each(function() {

        let $e = $(this);

        // add a listener to execute the toggle function
        if (!$e.data('init-listeners')) {

            // toggle function
            $e.on("click", function () {

                // grab the target curtain element
                let tar = $e.attr("data-curtain-target");
                let $curtains = $(".curtain-target");
                let $tarEle = $curtains.filter("[data-curtain='" + tar + "']");

                // check to see if there are mutually exclusive curtains
                let curtainGroup = $tarEle.attr("data-curtain-group");
                if (typeof curtainGroup !== "undefined") {
                    $curtains
                        .filter("[data-curtain-group='" + curtainGroup + "']")
                        .not("[data-curtain='" + tar + "']")
                        .each(function() {
                            $(this).trigger("close", [$(this)])
                        });
                }

                if ($tarEle.hasClass("closed")) {
                    $tarEle.trigger("open", [$(this)]);
                } else {
                    $tarEle.trigger("close", [$(this)]);
                }

            });
            $e.data('init-listeners', true);
        }

    });

    // create click event to curtain open/close controls
    $ele.find('[data-curtain]').each(function() {

        var $e = $(this);

        // click
        if (!$e.data('init-listeners')) {
            $e.on("click", function (e) {
                var a = $(e.target).attr('data-curtain');
                var $tar = $('[data-curtain-target="' + a + '"]');
                var h = parseInt($tar.attr('data-contents-height'));
                if ($tar.hasClass('closed')) {
                    $tar.css('max-height', h + 'px');
                    $tar.removeClass('closed');
                } else {
                    $tar.css('max-height', '0');
                    $tar.addClass('closed');
                }
            }).on("close", function() {

            });
            $e.data('init-listeners', true);
        }

    });

};

const closeCurtains = function($ele) {

    $ele = dp($ele, $(document));
    $ele.find('[data-curtain]').each(function() {
        $(this).trigger("close");
    });

};


// set up tabs
const initializeTabs = function($ele) {

    $ele = dp($ele, $(document));

    // standard tab containers
    /*$ele.find('.tab').each(function() {

        // click
        if ($(this).data('init-click', false)) {
            $(this).on("click", function(e) {
                var tar = $(this).attr("data-tab");
                var close = $(this).attr("data-untab");

                $('.' + close).addClass("hidden");
                $('[data-tab-target="' + tar + '"]').removeClass("hidden");
            });
            $(this).data('init-click', true);
        }

    });*/

    // select controls that open up tab containers
    $ele.find('.option-tab').closest('select').each(function() {

        var $e = $(this);

        // change
        if (!$e.data('init-change')) {
            $e.on("change", function () {
                var $o = $(this).find('option:checked');

                var tar = $o.attr("data-tab");
                var $close = $('.' + $o.attr("data-untab"));

                if ($close.length > 0) {
                    $close.addClass("hidden");
                }
                $('[data-tab-target="' + tar + '"]').removeClass("hidden");
            });
            $e.data('init-change', true);
        }

    });

};


/////////////////////////////////////////////////
//                                             //
//    M O D A L S                              //
//                                             //
/////////////////////////////////////////////////


const initializeModals = function($ele) {

    $ele = dp($ele, $(document));

    // remove the modal if the user clicks some things
    $ele.find('.modal.light-dismiss').each(function() {

        var $e = $(this);

        // click
        if (!$e.data('init-click')) {
            $e.on("click", function (e) {
                if ($(e.target).hasClass('light-dismiss')) {
                    modalToggle();
                }
            });
            $e.data('init-click', true);
        }

    });

    $ele.find(".close-modal").each(function() {

        var $e = $(this);

        // click
        if (!$e.data('init-click')) {
            $e.on("click", modalToggle);
            $e.data('init-click', true);
        }

    });


};

// show a modal and optionally hide all modals
const modalToggle = function(options) {

    // prevent a click from opening and closing the modal at once
    event.stopPropagation();

    options = dpo(options, {
        "id" : false
    });

    var $b = $('body');
    var $bg = $('.overlay-bg');
    // remove all modals
    $('.modal').removeClass('active');
    $b.removeClass("modal-open");
    // stop there if id is not provided
    if (!options['id']) {
        $bg.removeClass('active');
        return false;
    }
    // show the specified modal
    var $p = $('#' + options['id']);
    $bg.addClass('active');
    $p.addClass('active');
    $b.addClass("modal-open");

    // initialize controls in the modal
    initializeControls($p);

    return true;
};


//////////////////////////////////////////////////////////////////
//                                                              //
//    P O P U P S                                               //
//                                                              //
//    On click or hover, show a piece of html content,          //
//    attached to an element on-page                            //
//                                                              //
//    the HTML content is created and destroyed in this         //
//    process, and the element is "light-dismiss"               //
//                                                              //
//////////////////////////////////////////////////////////////////

//
//  INITIALIZE POPUPS
//
const initializePopups = function($ele) {
    $ele = dp($ele, $(document));
    $ele.find(".popup-trigger").each(function() {

        var $e = $(this);
        var trigger = $e.attr("data-trigger") ? $e.attr("data-trigger") : "click";
        var content;
        if (typeof $e.attr("data-content") === "undefined") {
            if (typeof $e.attr("data-content-id") === "undefined") {
                console.error("popup content not defined for " + $e);
                return;
            }
            content = $("#" + $e.attr("data-content-id")).html();
        } else {
            content = $e.attr("data-content");
        }

        switch (trigger) {
            case "hover":
                // for hover, mouseleave needs to also be assigned
                if (!$e.data("init-hover")) {
                    $e.hover(
                        function() {
                            popup(content);
                        },
                        function(e) {
                            // only dismiss if the mouse isn't on the popup itself
                            if ($(e.relatedTarget).parents(".popup-wrapper").length) {
                                $(".popup-wrapper").one("mouseleave", closePopup);
                            } else {
                                closePopup();
                            }
                        }
                    );
                    $e.data("init-hover", true);
                }
                break;
            default:
                // if the trigger isn't defined, or if it's click
                if (!$e.data("init-click")) {
                    $e.on("click",
                        function() {
                            popup(content);
                        }
                    );
                    $e.data("init-click", true);
                }
                break;

        }


    });

};

const popup = function($contents, options) {

    // error cases
    if (typeof($contents) === "undefined") {
        console.error("no contents provided");
        return false;
    }

    // prevent click event from removing
    // the popup as soon as it appears
    if (typeof event !== "undefined") event.stopPropagation();

    // default parameters
    var $body = $("body");
    options = dpo(options, {
        "light-dismiss" : true,
        "pos" : "cursor",
        "ydir" : "bottom",
        "xdir" : "center",
        "buffer-top" : 0,
        "buffer-left" : 0,
        "padding": "normal",
        "override-offscreen-prevention": false,
        "wrapper": $body
    });

    // remove previous popups
    $(".popup-wrapper").trigger("close");

    // put the element on the page
    var $p = $("<div></div>").addClass("popup-wrapper");
    var $pi = $("<div></div>").addClass("popup");
    var $wrapper = options['wrapper'];
    $pi.append($contents);
    $p.append($pi);
    $wrapper.append($p);

    var x, y,
        w = $wrapper.width(),
        h = $wrapper.height(),
        pw = $p.width(),
        ph = $p.height(),
        wh = window.innerHeight,
        ww = window.innerWidth,
        st = $(window).scrollTop(),
        bw = $body.width();

    // set top/bottom & left/right values
    if (options['pos'] === "cursor") {

        // get the numbers
        x = event.pageX;
        y = event.pageY;

    } else if (typeof(options['pos']) === "object") {

        if (typeof(options['pos'][0]) === "number" && typeof(options['pos'][1]) === "number") {
            x = options['pos'][0];
            y = options['pos'][1];
        } else {
            console.error("unrecognized format for 'pos' -- should be [x, y]. Provided: " + options['pos'])
        }

    } else {
        console.error("non-standard variable provided for 'pos' : " + options['pos']);
    }

    // let x represent the left of the popup
    x -= (pw / 2);

    // let y represent the top of the popup
    if (options["ydir"] === "bottom") {
        y -= ph;
    } else if (options["ydir"] === "middle") {
        y -= (ph/2);
    }

    x += options['buffer-left'];
    y += options['buffer-top'];

    // adjust for less-than-full-width wrappers
    if (w < bw) {
        x -= ((bw - w) / 2);
    }

    // error correct if the popup falls off the screen
    if (!options['override-offscreen-prevention']) {
        if (ph > wh) {
            // if the popup is gonna be taller than the screen
            y = st;
            $p.css("height", wh + "px");
        } else {
            if (y + ph > h) {
                // if the popup is below the bottom of the screen
                y = h - ph;
            } else if (y < st) {
                // if the popup is above the top of the screen
                y = st;
            }
        }
        if (pw > ww) {
            // if the popup is gonna be wider than the screen
            x = 0;
            $p.css("width", "100%");
        } else {
            if (x + pw > w) {
                // if the popup goes off the right of the screen
                x -= ((x + pw) - w);
            } else if (x < 0) {
                // if the popup goes off the left of the screen
                x = 0;
            }
        }
    }

    // now set the css (position) and click events
    $p
        .css({
            "top" : y+ "px",
            "left" : x+ "px"
        })
        .addClass("active " + options["padding"])
        .on("click", function() {
            // prevent clicks on it from closing it
            event.stopPropagation();
        })
        .on("close", function() {
            $(this)
                .animate({
                    "opacity": 0
                }, 200, function() {
                    $(this).delay(200).remove();
                })
        });

    // if this is set to false, then the popup needs some manual method to close
    if (options['light-dismiss']) {
        // make sure the popup gets closed on any click
        $(window).one("click", function() {
            $p.trigger("close");
        });
    }

};

/* older version of the popup function?
var popup = function($contents, options) {

    // error cases
    if (typeof($contents) === "undefined") {
        console.error("no contents provided");
        return false;
    }

    // prevent click event from removing
    // the popup as soon as it appears
    if (typeof event !== "undefined") event.stopPropagation();

    // default parameters
    options = dpo(options, {
        "light-dismiss" : true,
        "pos" : "cursor",
        "ydir" : "bottom",
        "xdir" : "center",
        "buffer-top" : 0,
        "buffer-left" : 0,
        "padding": "normal",
        "override-offscreen-prevention": false
    });

    // remove previous popups
    $(".popup-wrapper").trigger("close");

    // put the element on the page
    var $p = $("<div></div>").addClass("popup-wrapper");
    var $pi = $("<div></div>").addClass("popup");
    var $body = $("body");
    $pi.append($contents);
    $p.append($pi);
    $body.append($p);

    var w = $body.width();
    var h = $body.height();
    var pw = $p.width();
    var ph = $p.height();
    var wh = window.innerHeight;
    var ww = window.innerWidth;
    var st = $(window).scrollTop();

    // set top/bottom & left/right values
    if (options['pos'] === "cursor") {

        // get the numbers
        var x = event.pageX;
        var y = event.pageY;

    } else if (typeof(options['pos']) === "object") {
        
        if (typeof(options['pos'][0]) === "number" && typeof(options['pos'][1]) === "number") {
            x = options['pos'][0];
            y = options['pos'][1];
        } else {
            console.error("unrecognized format for 'pos' -- should be [x, y]. Provided: " + options['pos'])
        }

    } else {
        console.error("non-standard variable provided for 'pos' : " + options['pos']);
    }

    // let x represent the left of the popup
    x -= (pw / 2);

    // let y represent the top of the popup
    if (options["ydir"] === "bottom") {
        y -= ph;
    } else if (options["ydir"] === "middle") {
        y -= (ph/2);
    }

    x += options['buffer-left'];
    y += options['buffer-top'];

    // error correct if the popup falls off the screen
    if (!options['override-offscreen-prevention']) {
        if (ph > wh) {
            // if the popup is gonna be taller than the screen
            y = st;
            $p.css("height", wh + "px");
        } else {
            if (y + ph > h) {
                // if the popup is below the bottom of the screen
                y = h - ph;
            } else if (y < st) {
                // if the popup is above the top of the screen
                y = st;
            }
        }
        if (pw > ww) {
            // if the popup is gonna be wider than the screen
            x = 0;
            $p.css("width", "100%");
        } else {
            if (x + pw > w) {
                // if the popup goes off the right of the screen
                x -= ((x + pw) - w);
            } else if (x < 0) {
                // if the popup goes off the left of the screen
                x = 0;
            }
        }
    }

    // now set the css (position) and click events
    $p.css({
            "top" : y+ "px",
            "left" : x+ "px"
        })
        .addClass("active " + options["padding"])
        .on("click", function() {
            // prevent clicks on it from closing it
            event.stopPropagation();
        })
        .on("close", function() {
            $(this)
                .animate({
                    "opacity": 0
                }, 200, function() {
                    $(this).delay(200).remove();
                })
        });

    // if this is set to false, then the popup needs some manual method to close
    if (options['light-dismiss']) {
        // make sure the popup gets closed on any click
        $(window).one("click", function() {
            $p.trigger("close");
        });
    }

};
*/

const closePopup = function() {
    $(".popup-wrapper").each(function() {
        $(this).trigger("close");
    });
};

//
//    I N F O   N O D E S
//
//  This is for little interactive modules consisting of a graphic (background)
//  and several positioned nodes (using HTML attributes for x and y) that trigger
//  a popup when hovered
//
const initializeInfoNodes = function($ele) {

    $ele = dp($ele, $(document));
    $ele.find(".info-node").each(function() {

        var $e = $(this);

        // placement
        var x = $e.attr("data-position-x");
        var y = $e.attr("data-position-y");
        $e.css({
            "top": y + "px",
            "left": x + "px"
        });

        // hover
        if (!$e.data("init-hover")) {
            $e.on("mouseover", function() {

                // get the content of the info node
                var $contents = $(this).children().html();
                var st = $(window).scrollTop();
                // put it in a popup, account for weird top buffer
                popup($contents, {
                    "buffer-top": -120,
                    "pos": [$(this).offset().left + ($(this).width() / 2), $(this).offset().top + st],
                    "override-offscreen-prevention": true
                });

            }).on("mouseout", function() {
                // close all popups
                closePopup();
            });
            $e.data("init-hover", true);
        }

    });

};