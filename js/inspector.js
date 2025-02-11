const initializeInspector = function($ele) {

    $ele = dp($ele, $(document));

    let c = $ele.find('*');

    console.log(c);



};

const inspect = function($ele) {

    console.log($ele);

    $('body').hover(function(event){
        var el = document.elementFromPoint(event.pageX, event.pageY);
    });

};