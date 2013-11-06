function SlideFrame()
{
    var frameEvents = [];
    var currentFrame = 'mainFrame';
    var mainFrameScreenOffset = 0;
    var self = this;
    
    this.eventType = { onLoad : 0, onUnload : 1, onLoadComplete : 2, onUnloadComplete : 3 };
    
    this.getFrameName = function()
    {
        return currentFrame;   
    }
    
    this.addFrameEvent = function(frameId, callback, eventType)
    {
        if(!$('div#' + frameId).length)
            console.log('No div with id ' + frameId);
        
        if(typeof frameId === 'string' && typeof callback === 'function' && typeof eventType === 'number')
        {
            if(typeof frameEvents[frameId] === 'undefined')
                frameEvents[frameId] = [];
            
            frameEvents[frameId][eventType] = callback;
        }
        else
            console.log('Invalid arguments');
        
        return this;
    }
    
    this.displayFrame = function(frameId, callback)
    {
    	if(typeof frameId !== 'string' || frameId === 'mainFrame' || !$('div#content_wrapper div#' + frameId).length)
            frameId = 'mainFrame';
        
        if(currentFrame !== frameId)
        {
            var previousFrame = $('div#content_wrapper').find('div#' + currentFrame);
            var newFrame = $('div#content_wrapper').find('div#' + frameId);
            var offset = 0;
            
            //if we are switching from the mainFrame keep the offset
            if(currentFrame === 'mainFrame')
                mainFrameScreenOffset = window.pageYOffset;
            
            if(typeof frameEvents[frameId] === 'object' && typeof frameEvents[frameId][self.eventType.onLoad] === 'function')
                frameEvents[frameId][self.eventType.onLoad]();
            
            if(typeof frameEvents[currentFrame] === 'object' && typeof frameEvents[currentFrame][self.eventType.onUnload] === 'function')
                frameEvents[currentFrame][self.eventType.onUnload]();
            
            previousFrame.add(newFrame).slideToggle('fast', function()
            {
                if(++offset === 2)
                {
                	function triggerCompleteEvents()
                	{
	                    if(typeof frameEvents[frameId] === 'object' && typeof frameEvents[frameId][self.eventType.onLoadComplete] === 'function')
	                        frameEvents[frameId][self.eventType.onLoadComplete]();
	                    
	                    if(typeof frameEvents[currentFrame] === 'object' && typeof frameEvents[currentFrame][self.eventType.onUnloadComplete] === 'function')
	                        frameEvents[currentFrame][self.eventType.onUnloadComplete]();
                    }
                    
                    if(frameId === 'mainFrame')
                    {
                    	var offset2 = 0;
                        $('html, body').animate({ scrollTop : mainFrameScreenOffset }, 'fast', function(){ if(++offset2 === 2)
                        {
	                        triggerCompleteEvents();
                        }});
                    }
                    else
                    {
                        newFrame.find('input').first().select();
                        triggerCompleteEvents();
                    }						
                }
            });
            
            currentFrame = frameId;
        }
        
        return this;
    }
    
    //Only display the mainFrame upon pageload.
    $(function() { $('div#content_wrapper div#mainFrame').show().siblings('div').hide(); });
}

//Initialization of the slideFrame
var sFrame;
$(function(){ sFrame = new SlideFrame(); });