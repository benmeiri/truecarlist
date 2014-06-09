


    var modelListOfItems = [];


    function getTemplate(text){
        return  '<a class="item-text">' + text + '</a><span  class="delete-item btn">delete</span>';
    }

    //Well, IE8 sucks.
    function addEventToElement(element,event,callback){
        if (element.addEventListener) {
            element.addEventListener(event, callback, false);
        }
        else if (element.attachEvent) {
            element.attachEvent(event, callback );
        }
    }

    function removeEventToElement(element,event,callback){
        if (element.removeEventListener) {
            element.removeEventListener(event, callback, false);
        }
        else if (element.detachEvent) {
            element.detachEvent(event, callback );
        }
    }

    function findClosetClassParent(node, className){
        if (node.tagName.toLowerCase() === 'body'){
            return null;
        }
        var len = node.classList.length;
        var found = false;

        if (node.tagName.toLowerCase() === className.toLowerCase() ){
            return node;
        }
        for (var i = 0 ; i < len ; i++){

            if (node.classList[i] == className){
                found = true;
            }
        }
        if (found){
            return node;
        }
        return (findClosetClassParent(node.parentNode, className));
    }


    function deleteNode(node){
        //remove the added event listener. Prevent memory leaks
        removeEventToElement(node.target,"click",deleteNode);
        var li =  findClosetClassParent(node.target, 'li');
        var list =  findClosetClassParent(li, 'list-items-container');
        var index = Array.prototype.indexOf.call(list.children, li);
        modelListOfItems.splice(index,1);
        list.removeChild(li);
    }


    function addNodes(arr){
        //this is so we don't make DOM call every iteration
        var list = document.getElementsByClassName('list-items-container')[0];
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
        var deleteButtons = document.getElementsByClassName('delete-item');
        var length = deleteButtons.length;
        for(var i = 0 ; i < length ; i++){
            removeEventToElement(deleteButtons[i],'click',deleteNode);

        }

        //this is much faster than .innerHtml = '' as seen here  http://jsperf.com/innerhtml-vs-removechild/15
        var list = document.getElementsByClassName('list-items-container')[0];
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
            if (Array.prototype.indexOf.call(event.target.classList,'disable-click') !== -1  ){
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
