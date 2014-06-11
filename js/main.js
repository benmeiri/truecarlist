


    var modelListOfItems = [];


    function getTemplate(text){
        return  '<div class="item-container"><a class="item-text">' + text + '</a><span  class="delete-item btn">delete</span></div>';
    }
    ///////////////
    //Well, IE8 sucks. start of special IE8 functions
    /////////////
    var eventIENames = {
        'load':'onload',
        'click':'onclick'
    }

    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function(obj, start) {
            for (var i = (start || 0), j = this.length; i < j; i++) {
                if (this[i] === obj) { return i; }
            }
            return -1;
        }
    }

    if(typeof String.prototype.trim !== 'function') {
        String.prototype.trim = function() {
            return this.replace(/^\s+|\s+$/g, '');
        };
    }

    function getTarget(event){
        return (event.target) ? event.target : event.srcElement;
    }

    function getIEEventName(name){
        return (eventIENames[name]) ? eventIENames[name] : name;
    }

    function addEventToElement(element,event,callback){
        if (element.addEventListener) {
            element.addEventListener(event, callback, false);
        }
        else if (element.attachEvent) {
            element.attachEvent(getIEEventName(event), callback );
        }
    }

    function removeEventToElement(element,event,callback){
        if (element.removeEventListener) {
            element.removeEventListener(event, callback, false);
        }
        else if (element.detachEvent) {
            element.detachEvent(getIEEventName(event), callback );
        }
    }


    function getElementsByClassName(className){
        if (!document.getElementsByClassName){
            return   document.querySelectorAll('.' + className);
        }else{
            return document.getElementsByClassName(className);
        }

    }

    function getClassList(element){
        return (element.classList) ? element.classList : element.className.trim().split(/[ ,]+/);
    }

    /// end of IE8 sucks



    function findClosetClassParent(node, className){
        if (node.tagName.toLowerCase() === 'body'){
            return null;
        }

        var list = getClassList(node);
        var len = list.length;
        var found = false;

        if (node.tagName.toLowerCase() === className.toLowerCase() ){
            return node;
        }
        for (var i = 0 ; i < len ; i++){

            if (list[i] == className){
                found = true;
            }
        }
        if (found){
            return node;
        }
        return (findClosetClassParent(node.parentNode, className));
    }


    function deleteNode(event){
        var target = getTarget(event);
        //remove the added event listener. Prevent memory leaks
        removeEventToElement(target,"click",deleteNode);
        var li =  findClosetClassParent(target, 'li');
        var list =  findClosetClassParent(li, 'list-items-container');
        var index = Array.prototype.indexOf.call(list.children, li);
        modelListOfItems.splice(index,1);
        list.removeChild(li);
    }


    function addNodes(arr){
        //this is so we don't make DOM call every iteration
        var list = getElementsByClassName('list-items-container')[0];
        var li,
            arrLength = arr.length,
            fragment = document.createDocumentFragment();
        for (var i = 0; i < arrLength; i++) {
            li = document.createElement('li');
            li.innerHTML = getTemplate(arr[i]);
            addEventToElement( li.querySelector('.delete-item'),"click", deleteNode);
            fragment.appendChild(li);
        }
        list.appendChild(fragment);


        /*
         I scroll to the bottom of the page and not the div because the page is where the scroller currently.
         the previous implementation when I had a list in a div I used this method:
         var objDiv = document.querySelector(".listed-items-container");
         document.scrollTop = objDiv.scrollHeight;
         */
        //scroll to the end of the list
        window.scrollTo(0,document.body.scrollHeight);
    }

    function addNode(){
        var text = document.querySelector('.text-input').value;
        if (!text){
            alert("Item name can't be empty");
            return;
        }
        modelListOfItems.push(text);
        addNodes([text])
    }

    function loadFromJson(){
        var textarea = document.querySelector( 'textarea' );
        var jsonList;
        try{
            jsonList = JSON.parse(textarea.value);
        }catch(err){
            //would log this
            alert('error with JSON. Not a valid list');
            return;
        }

        modelListOfItems = jsonList;
        var deleteButtons = getElementsByClassName('delete-item');
        var length = deleteButtons.length;
        for(var i = 0 ; i < length ; i++){
            removeEventToElement(deleteButtons[i],'click',deleteNode);

        }

        //this is much faster than .innerHtml = '' as seen here  http://jsperf.com/innerhtml-vs-removechild/15
        var list = getElementsByClassName('list-items-container')[0];
        while (list.lastChild ) {
            list.removeChild(list.lastChild );
        }
        addNodes(modelListOfItems);


    }

    function saveToJson(){
        var textarea = document.querySelector( 'textarea' );
        textarea.value = JSON.stringify(modelListOfItems);
    }



    function initAllEvents(){
        var addButton = document.querySelector( '.add-button' );
        addEventToElement(addButton,"click",function(event){
            //we clicked inside the input area.
            //why doesn't IE has target.classList or target?!?!?!?!
            var target = getTarget(event);
            if (target.className.indexOf('disable-click') !== -1  ){
                return;
            }
            addNode();
        })

        addEventToElement(addButton,"keypress", function(event){
            if (event.keyCode === 13){
                addNode();
            }
        } );


        var saveButton = document.querySelector( '.save-button' );
        addEventToElement(saveButton,"click",saveToJson);

        var loadButton = document.querySelector( '.load-button' );
        addEventToElement(loadButton,"click",loadFromJson);



    }

    //I'm not sure if these events need to be remove, because it only happen when the tab/browser is closed.
    addEventToElement(window,'load',initAllEvents);
