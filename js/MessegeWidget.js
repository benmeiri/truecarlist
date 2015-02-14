var MessegeWidget = (function($,window,document,undefined){


 	function getTemplate(text){
        return  '<div class="item-container"><a class="item-text">' + text + '</a><span  class="delete-item btn">delete</span></div>';
    }

     function deleteNode(elem, modelListOfItems){
        var liParent =  $(elem).closest('li'),
        index = liParent.index();
        liParent.remove();
        modelListOfItems.splice(index,1);
    }

 
	function MessegeWidgetImpl (config) {
		this.config = $.extend({},config);
		this.modelListOfItems = [];
	};


	MessegeWidgetImpl.prototype.init = function init(){
		var self = this;
 		this.config.addButton.on('click',function(e){
            var target = $(e.target);
            if (target.is('input')){
                return;
            }
            self.addNode();
        });
        
        this.config.addButton.on('keypress',function(e){
            if(e.which === 13){
                self.addNode();
            }
        });

        this.config.list.on('click','.delete-item',function(){
        	deleteNode(this,self.modelListOfItems);
        });
	};

	MessegeWidgetImpl.prototype.addNodes = function addNodes(arr){
        //this is so we don't make DOM call every iteration        
        var li,
            arrLength = arr.length,
            fragment = document.createDocumentFragment(),
            deleteHelper = $('<div/>');
        for (var i = 0; i < arrLength; i++) {
        	var escapedText = deleteHelper.text(arr[i]).html();
            li = document.createElement('li');
            this.modelListOfItems.push(escapedText);
            li.innerHTML = getTemplate(escapedText);
            fragment.appendChild(li);
        }
        this.config.list.append(fragment);

        /*
         I scroll to the bottom of the page and not the div because the page is where the scroller currently.
         the previous implementation when I had a list in a div I used this method:
         var objDiv = document.querySelector(".listed-items-container");
         document.scrollTop = objDiv.scrollHeight;
         */
        //scroll to the end of the list
        window.scrollTo(0,document.body.scrollHeight);
    }

    MessegeWidgetImpl.prototype.addNode = function addNode(){
        var text = this.config.input.val();
        if (!text){
        	this.config.messenger.show('Item error', 'Item name can\'t be empty');
            return;
        }       
        this.addNodes([text]);
    }
  

     MessegeWidgetImpl.prototype.clear = function clear(){
     	this.config.list.empty();
        this.modelListOfItems = [];        
    }

	return MessegeWidgetImpl;
	
})(jQuery,window,document);