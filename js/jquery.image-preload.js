(function($){
    var o, preloadDiv, progressDiv, mode, count, image, effect, target,loadPercent=0;
    $.fn.imagePreloader=function(options){
        var o =$.extend({
            target:'body',
            mode:'invisible',
            effect:'slideUp'
        },options||{})
        mode=o.mode;
        target=o.target;
        effect=o.effect;
        
        //(mode=='fullScreen'||mode=='inside')?:'';
         
        var images=this.filter('img').filter(function(){
            if($(this).attr('src')!=''){
                return this;
            }
        });
        var divsBg=this.not('img').filter(function(index){
            if($(this).css('background-image') !="none"&&$(this).css('background-image') !=""){
                return  this;
            }
        })
        
        
        
        var all=images.add(divsBg);
        count=images.size()+divsBg.size();
        
       // alert(count)
        
        if(count>0){
            wayAppendPreload()
            var unit =equalParts(count,$('.p_progress').width());
            var status=true;
            var unitPc=equalParts(count,100);
            
            return all.each(function(){
                var e=$(this);
                _debug(e.attr('src')||e.css('background-image'))
                loadOne(e,function(){
                    status=true
                });
            });
        }
    
        function loadOne(e,callback){
            if(status){
                status=false;
                if(e.attr('src')||(e.css('background-image')!='none'&&e.css('background-image')!=''&&e.css('background-image').indexOf('gradient')==-1)){
                    e.css({
                        visibility:'hidden'
                    });
                    var src=e.attr('src');
                    var background=false;
                    if(e.css('background-image') !="none"&&e.css('background-image')!=""){
                        background=true;
                        src=e.css('background-image').substring(4,e.css('background-image').length-1);
                        if($.browser.msie||$.browser.mozilla){
                            src=src.substring(1,src.length-1)
                        }
                    }
                    ($.browser.msie||background?image=$('<img/>').attr('src',src):e).load(function(){
                        count-=1;
                        mode!='invisibleAll'?$(e).css({
                            visibility:'visible'
                        }):'';
                        if(mode!='invisible'&&mode!='invisibleAll'){
                            progressLoad();
                            if(count==0){
                                showLoaded();
                            }
                        }
                        else if(mode=='invisibleAll'&&count==0){
                            all.css('visibility','visible');
                        }
                    })
                }
            }
            callback('status')
        }
        
        function progressLoad(){
            var progressBg=$('.p_progress_wrapper .progress');
            var progressPc=$('.p_progress_wrapper span.percents');
            var width=parseFloat(progressBg.width());
            if(count-1==0){
                loadPercent+=unitPc[1];
                progressPc.html(loadPercent+'%');
                progressBg.css({
                    'width':width+unit[1]+10
                })
            }else{
                loadPercent+=unitPc[0];
                progressPc.html(loadPercent+'%');
                progressBg.css({
                    'width':width+unit[0]
                })
            }
        }
    };
    
    /*FUNCTIONS*/

    function showLoaded(){
        var pCont=$('#p_container');
        if(pCont){
            switch (effect){
                case 'none':
                    progressDiv.find('span:first').html('Loading Done!');
                    break;
                case 'fadeOut':
                    pCont.fadeOut(3000,function(){
                        $(this).remove();
                    });
                    break;
                case 'slideUp':
                    pCont.slideUp(1000,function(){
                        $(this).remove();
                    });
                    break;
            }
        }
    }
    //this about how show to user loading process
    function wayAppendPreload(fHSettings){
        preloadDiv=$('<div id="p_container"/>');
        progressDiv=$('<div class="p_progress_wrapper"><div class="p_progress"><span>Loading</span><span class="percents">0%</span><div class="progress"></div></div></div>');
        
        var s=$.extend({
            width:'100%',
            height:'100%'
        },fHSettings||{});
        
        var position;
        
        if(mode=='fullScreen'){
            position='fixed';
        }
        else if(mode=='inside'){
            position='absolute';
        }
        else{
            position='relative'
        }
        
        if(mode!='invisible'&&mode!='invisibleAll')  {
            $(target).css({
                'position':'relative'
            }).append(preloadDiv);
            preloadDiv.append(progressDiv);
            preloadDiv.css({
                position:position,
                width:s.width,
                height:s.height
            })
        }
    }
    
    //function for almost equal parts of any number per some pieces.
    function equalParts(quantity,max){
        var result=new Array();
        var wholeNumber=parseInt(max/quantity);
        var lastElement=max-(wholeNumber*(quantity-1));
        if(lastElement>=quantity){
            wholeNumber+=parseInt(lastElement/quantity);
            lastElement=max-wholeNumber*(quantity-1);
        }
        result.push(wholeNumber,lastElement,quantity,max);
        
        return result;
    }
    
    function _debug(msg){
        if(window.console){
            console.debug(msg);
        }
    }
})(jQuery);