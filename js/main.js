(function($,window,document, undefined){



  
    var jsonText,loadButton ,saveButton, widget,
     messenger;  


    function loadFromJson(){        
        var jsonList;
        try{
            jsonList = JSON.parse(jsonText.val());
        }catch(err){
            messenger.show('JSON Error', 'error with JSON. Not a valid list');
            return;
        }
               
        widget.clear();
        widget.addNodes(jsonList);
    }

    function saveToJson(){        
        jsonText.val(JSON.stringify(widget.modelListOfItems));
    }

    function init(){
        //cache the elements
        saveButton = $('.save-button'),
        loadButton = $('.load-button');               
        jsonText = $( 'textarea' );

        //add events
        saveButton.on('click',saveToJson);
        loadButton.on('click',loadFromJson);       

        //create the messege display and the widget
        messenger = new MessegeDisplay({container: $('body')});

         widget = new MessegeWidget({
            addButton: $('.add-button'),
            list : $('.list-items-container'),
            input : $('input.text-input'),
            messenger: messenger
         });
        widget.init();
    }

    $(document).ready(init);


})(jQuery, window,document);