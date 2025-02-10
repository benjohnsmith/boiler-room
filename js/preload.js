var preloadMessages = {
    "open": [
        "Take a second to appreciate the massive quantity of PNGs finding their way onto your hard drive right now",
        "Ah, the sweet serenity of the loading screen",
        "Nothing like a long pause to get the tension building",
        "Settle in, all these gifs take their sweet time to load"
    ],
    "middle": [
        "Watching a page load is like staring at someone getting dressed &mdash; this is my fitting room",
        "Hey at least it's not a photography portfolio, this could take way longer",
        "I'll say it: gif is pronounced with a hard &ldquo;G&rdquo; &mdash; it stands for &ldquo;Graphics&rdquo;",
        "Perceived performance is more important than actual performance",
        "I overuse M-dashes &mdash; I admit it and I am not ashamed",
        "Breakfast food is the best kind of food",
        "I just want you to see the site as it was meant to be seen",
        "A website without animations is like a bowl of cereal without milk"
    ],
    "close": [
        "Aww yeah, it's ready",
        "Boom &mdash; Record load time",
        "Bingo, all done",
        "Jackpot, loading finished",
        "Oh thank goodness, it's finally done",
        "Hey! the site is ready"
    ]
};
var canInteract = false;

$(function() {

    scrollTo(0);

    var $msg = $("#preload-teaser-1"),
        $preload = $(".preload"),
        olen = preloadMessages["open"].length,
        mlen = preloadMessages["middle"].length,
        blen = preloadMessages["close"].length,
        middleMessagesShown = [],
        curTeaser = 1,
        nextTeaser = 2;

    var omsg = rnd(0, olen),
        bmsg = rnd(0, blen);

    // must match CSS value in transition
    var easeSpeed = 500;

    // messages stay on screen for...
    var messageDuration = 4000;

    // stored for later so we can cancel any pending transitions
    var animatedTimeout;

    // get an entry message and show it
    $msg.html(preloadMessages["open"][omsg]);
    $preload.find(".contents").addClass("visible");

    // cycle through middle messages
    var animation = setInterval(function() {

        nextTeaser = (curTeaser === 1) ? 2 : 1;

        // reset "recorded" messages if you've shown every message
        if (middleMessagesShown.length >= mlen) middleMessagesShown = [];
        // otherwise get a fresh message
        var mmsg = rnd(0, mlen);
        while ($.inArray(mmsg, middleMessagesShown) > -1) {
            mmsg = rnd(0, mlen);
        }
        middleMessagesShown.push(mmsg);

        var $nextMsg = $("#preload-teaser-" + nextTeaser);
        $nextMsg.html(preloadMessages["middle"][mmsg]);

        // animate out the old message, wait, then animate in the new one
        $("#preload-teaser-" + curTeaser).removeClass("visible");
        animatedTimeout = setTimeout(function() {
            $nextMsg.addClass("visible");
        }, easeSpeed);

        // swap the values of cur/nextTeaser
        curTeaser = [nextTeaser, nextTeaser = curTeaser][0];

    }, messageDuration);

    // tack on a finisher and cancel animations
    $(window).on("load", function() {

        clearInterval(animation);
        clearTimeout(animatedTimeout);

        var $nextMsg = $("#preload-teaser-" + nextTeaser);
        $nextMsg.html(preloadMessages["close"][bmsg]);

        // animate out the old message, wait, then animate in the new one
        $("#preload-teaser-" + curTeaser).removeClass("visible");
        setTimeout(function() {
            $nextMsg.addClass("visible");
        }, easeSpeed);

        setTimeout(function() {
            $preload.addClass("finished");
            $("body").removeClass("no-scroll");
            canInteract = true;
        }, messageDuration / 2);

        initializeControls();

    });

});

