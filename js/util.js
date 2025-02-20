//
//    H E L P E R   F U N C T I O N S
//
//  these functions are designed to be used within
//  other functions as an optimization or aid
//
//////////////////////////////////////////////////

// used to specify default parameters
// arg = passed arg
// def = default value
//
//   sample usage:
/*
     doThis = function(option1, option2) {
         option1 = dp(option1, "defaultval1");
         option2 = dp(optoin2, "defaultval2");
     }
*/
const dp = function(arg, def) {
    return (typeof arg === "undefined" ? def : arg);
};

// used to specify a default parameters obj
// different from the above as the entire object is
// an optional value
//
//   sample usage:
/*
     doThis = function(options) {
         options = dpo(options, {
             "defaultparam1" : "val1"
         });
     }
     doThis();
*/
const dpo = function(obj, def) {
    if (typeof obj !== "undefined") {
        $.each(obj, function (i, p) {
            if (typeof p !== "undefined") {
                def[i] = p;
            }
        });
    }
    return def;
};

// return object size
const getObjectSize = function(obj) {
    let size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

// check object for contents
const objectHasProperties = function(obj) {
    for (let key in obj) { if (obj.hasOwnProperty(key)) { return true; } }
    return false;
};

// random numbers
const rnd = function(y, x) {
    return Math.floor(Math.random() * x) + y;
};


// check to see if an array/object has contents
//
// Speed up calls to hasOwnProperty
const hasOwnProperty = Object.prototype.hasOwnProperty;
function isEmpty(obj) {

    // null and undefined are "empty"
    if (obj === null || obj === "undefined") return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;

    // If it isn't an object at this point
    // it is empty, but it can't be anything *but* empty
    // Is it empty?  Depends on your application.
    if (typeof obj !== "object") return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (let key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
}


//
//    L A Y O U T   A N D   N A V I G A T I O N
//
//  open and close, respond to window actions, and
//  provide useful scrolling / expanding / moving
//  parts of the UI
//
//////////////////////////////////////////////////

// scroll to the element on the page, or given pixel value
// optional parameters:
//    buffer [int]: how many pixels above, to scroll to
//    container [obj]: the DOM element that will scroll
//    speed [int, string]: jquery.animate speed values
const scrollTo = function($target, params) {

    // stop existing animations if possible
    let htmlBody = $("html, body");
    htmlBody.stop(true, false);

    if (typeof $target === "undefined") {
        console.error("no target defined");
        return false;
    }

    let tar;
    if (typeof $target === "number") {
        tar = $target;
    } else {
        tar = $target.offset().top;
    }

    // default parameters
    params = dpo(params, {
        "buffer" : 100,
        "container" : htmlBody,
        "speed" : 500,
        "ease" : "swing"
    });

    params["container"]
        .animate(
            {
                scrollTop: tar - params["buffer"]
            },
            params["speed"],
            params["ease"],
            function() {
                $(window).off("wheel", scrollOverride);
            }
        );

    $(window).one("wheel", scrollOverride);

    function scrollOverride() {
        params["container"].stop();
    }

    return false;
};

// check to see if window is at the size specified
// if so execute specified argument as function
// 'instead' argument is optional
const responsiveState = function(size, dir, ex, instead) {
    let win = window.innerWidth;
    if (dir === "down") {
        if ((win >= 1200 && size !== "xl") ||
            (win >= 980 && (size !== "xl" && size !== "lg")) ||
            (win >= 768 && (size !== "xl" && size !== "lg" && size !== "md")) ||
            (win >= 480 && (size !== "xl" && size !== "lg" && size !== "md" && size !== "sm"))) {
                if (typeof instead !== "undefined" && instead !== false) instead();
        } else {
            ex();
        }
    } else if (dir === "up") {
        if ((win < 480 && (size !== "xs")) ||
            (win < 768 && (size !== "xs" && size !== "sm")) ||
            (win < 980 && (size !== "xs" && size !== "sm" && size !== "md")) ||
            (win < 1200 && (size !== "xs" && size !== "sm" && size !== "md" && size !== "lg"))) {
                if (typeof instead !== "undefined" && instead !== false) instead();
        } else {
            ex();
        }
    } else if (dir === "only") {
        if ((win < 480 && (size !== "xs")) ||
            (win < 768 && (size !== "sm")) ||
            (win < 980 && (size !== "md")) ||
            (win < 1200 && (size !== "lg")) ||
            (win >= 1200 && (size !== "xl"))) {
                if (typeof instead !== "undefined" && instead !== false) instead();
        } else {
            ex();
        }
    } else {
        console.log("specify dir: 'up', 'down', or 'only'");
    }
};

// Reveal an element, hide others (optional)
// for accordion-style UI
//
// tar = element ids
// grp = boolean
const reveal = function(tar, grp) {

    let $e = $('#' +tar);
    $e.animate({
        height: $e.get(0).scrollHeight
    }, 500, function(){
        $(this).height('auto');
    });

    if (grp) {
        // hide the other elements in this group
        $('.reveal').not('#' +tar).animate({
            height: 0
        }, 500, function(){
            $(this).height(0);
        });
    }

};

// Remove an element from the DOM by squishing
// it's height to 0 (animated)
const squeeze = function($ele, options) {

    options = dpo(options, {
        "callback": null
    });

    $ele.animate({
        "height" : "0",
        "margin" : "0",
        "padding" : "0"
    }, 500, "swing", function() {
        $ele.remove();
        if (typeof options['callback'] === "function") {
            options['callback']();
        }
    });

};


//
//    S T R I N G   M A N I P U L A T I O N
//
//  format, truncate, etc. with strings and objects
//
///////////////////////////////////////////////////

// basic utility that truncates strings
const truncate = function(str, options) {

    if (!str || typeof str !== "string") {
        return false; // error
    }

    // set defaults
    options = dpo(options, {
        "lim" : 40, // truncate after x characters
        "add" : "", // tag a "..." or some suffix on the end
        "brk" : [   // never include a hanging character in the following combinations
            " "
        ]
    });

    // recursive function to keep chipping away invalid chars
    let shorten = function(s) {
        let keepSearching = false;
        $.each(options['brk'], function (i, val) {
            // look for string match, starting at index where it would be problematic
            if (s.indexOf(val, s.length - val.length) === s.length - val.length) {
                s = s.substring(0, s.length - val.length);
                keepSearching = true;
                return false;
            }
        });
        return (keepSearching) ? shorten(s) : s;
    };

    // truncate
    if ((str.length > options["lim"]) ) {
        str = str.substring(0,options["lim"]);
        str = shorten(str);
        str += options["add"];
    }
    return str;

};

//   DATES
//
// get friendly date strings with js
const getFullDateString = function(date) {
    return getMonthString(date.getMonth()) + " " + getDateString(date.getDate()) + ", " + date.getFullYear();
};

// return the current date
const today = function() {
    let d = new Date();
    d = d.getMonth()+1 + "/" + d.getDate() + "/" + d.getFullYear();
    return d;
};
// return the current time
const now = function(seconds) {
    let t = new Date();
    let n = t.getHours() + ":" + t.getMinutes();
    if (seconds) n += ":" +t.getSeconds();
    return n;
};

const getMonthString = function(m, len) {
    if (typeof(len) === "undefined") {
        len = "short"
    }
    let strings = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];
    if (len === "long") {
        m = strings[m];
    } else if (len === "short") {
        m = strings[m];
        m = m.substring(0,3);
    } else if (len === "number") {
        m += 1;
    }
    return m;
};
const getHourString = function(h) {
    let suff = "am";
    if (h > 11) {
        h -= 12;
        suff = "pm";
    }
    if (h === 0) {
        h = 12;
    }
    return [h, suff];
};
const getMinuteString = function(m) {
    m += "";
    if (m.length < 2) {
        m = "0" + m;
    }
    return m;
};
const getDayString = function(d, len) {
    let weekdays = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];
    if (len === "short") {
        d = weekdays[d].substring(0,3);
        return d;
    }
    return weekdays[d];
};
// add a st, nd, rd, or th
const getDateString = function(d) {
    d++;
    d += "";
    let strlen = d.length;
    let suff = d.substring(strlen - 1, strlen);
    switch (suff) {
        case "1":
            suff = "st";
            break;
        case "2":
            suff = "nd";
            break;
        case "3":
            suff = "rd";
            break
        default:
            suff = "th";
            break;
    }
    return d+suff;
};


//
//    I N P U T
//
//  form fields, accessibility, etc.
//
////////////////////////////////////

// return true if the key pressed was enter
const preventNonEnterKey = function(e) {
    if (e.type === "keypress" && e.which !== 13) return true;
};

const resetForm = function($form) {
    // console.log($form);
    $form.find('input:text, input:password, input:file, select, textarea').val('');
    $form.find('input:radio, input:checkbox')
        .prop('checked', false).removeAttr('selected');
};

//
//  loop through the form-tag children of the container.
//  set the unique fields in that element to an ordered value.
//      id
//      name
//      for
//
const incrementUniqueAttributes = function($container) {

    // label, input, select
    $container.find("input, label, select, textarea").each(function() {

        let $ele = $(this);

        // make sure there is the data field we need
        let rootId = $(this).attr("data-modular-id");
        if (typeof rootId === "undefined") {
            console.error("no modular id found for a control in a modular container");
            return false;
        }

        // grab potential attributes (some will be "undefined")
        let attributes = {
            "for": $(this).attr("for"),
            "name": $(this).attr("name"),
            "id": $(this).attr("id")
        };

        // special case for radio buttons, which need shared names
        // but unique ids
        if ($(this).attr("type") === "radio") {
            // RADIO
            let rootName = $(this).attr("data-modular-name");
            if (typeof rootId === "undefined") {
                console.error("no modular name found for a radio button in a modular container");
                return false;
            }
            let newAttr = {
                "for": splitAndIncrement(attributes["for"], rootId),
                "id": splitAndIncrement(attributes["id"], rootId),
                "name": splitAndIncrement(attributes["name"], rootName)
            };
            $.each(newAttr, function(i, str) {
                $ele.attr(i, str);
            });
        } else {
            // NON RADIO
            $.each(attributes, function(i, str) {
                let newId = splitAndIncrement(str, rootId);
                $ele.attr(i, newId);
            });
        }

        // increment the numeric suffix of a value
        function splitAndIncrement(str, root) {
            if (typeof str === "undefined") return;
            let splitStr = str.split(root);
            splitStr = parseInt(splitStr[1], 10);
            if (isNaN(splitStr)) {
                console.error(str + " split & parse resulted in NaN");
                return false;
            }
            return root + (splitStr + 1);
        }

    });

};

// acccepts an HTML element (jquery)
// copies all innerHTML to clipboard
const copyToClipboard = function(element) {
    let $temp = $("<input>");
    $("body").append($temp);
    $temp.val($(element).text()).select();
    document.execCommand("copy");
    $temp.remove();
};

// basic utility for preloading images -- use sparingly
const preloadImages = function() {
    for (let i = 0; i < arguments.length; i++) {
        $("<img>").attr("src", arguments[i]);
    }
};

//  takes a point and a polygon, and tests to see if the point is inside
//  returns true/false
//  params:
//      point: [x, y]
//      poly: [[x, y], [x, y], [x, y] ...]
//
const pointInPolygon = function (point, poly) {

    let x = point[0], y = point[1];

    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
        let xi = poly[i][0], yi = poly[i][1];
        let xj = poly[j][0], yj = poly[j][1];

        let intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
};
