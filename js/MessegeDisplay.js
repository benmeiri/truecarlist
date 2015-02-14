var MessegeDisplay = (function($,window,document,undefined){

	var defaultConfig = {
		delay: 2500
	},
	$window = $(window);

	function createMessage(){
		return "<div><div class='noclick-background'></div><div class='error-message'>" +
		"<h1 class='error-header'></h1>" +
		"<p class='error-text'></p>" +
		"</div><div>";
	}

	function MessegeDisplayImpl(config){
		this.config = $.extend({},defaultConfig,config);
		this.init();
	}

	MessegeDisplayImpl.prototype.show = function(header, text){
		//recalculate the width because window width might change so I don't want to cache it. 
		//The same for the container (even thou this is unlikely )
		var self = this, leftValue = $window.width() / 2 - this.messageContainer.outerWidth() / 2;;
		clearTimeout(this.isVisible);
		this.isVisible = undefined;
		this.messageContainer.clearQueue().hide();
		this.background.show();
		this.header.text(header);
		this.text.text(text);		
		this.messageContainer.css('left',leftValue)
		.slideDown();
		this.isVisible = setTimeout(this.hide.bind(this),this.config.delay);
		
	};


	MessegeDisplayImpl.prototype.hide = function(){
		clearTimeout(this.isVisible)
		this.isVisible = undefined;			
		this.messageContainer.slideUp();
		this.background.hide();
	}

	MessegeDisplayImpl.prototype.init = function(){
		var self = this;
		this.messegeMain = $(createMessage());
		this.messageContainer = this.messegeMain.find('.error-message');
		this.header = this.messageContainer.find('.error-header');
		this.text = this.messageContainer.find('.error-text');
		this.config.container.append(this.messegeMain);
		this.background = this.messegeMain.find('.noclick-background');
		
		//close message on escape or click
		this.background.on('click',this.hide.bind(this));		
		$(document).on('keyup',function(e){
            if(self.isVisible && e.which === 27){
                self.hide();
            }
        });
	};

	return MessegeDisplayImpl;

})(jQuery,window,document);