(function ($) {
    var o, preloadDiv, progressDiv, mode, count, image, effect, target, unit, unitPc, loadPercent = 0;
    $.fn.imagePreloader = function (options, callback) {

        o = $.extend({
            target: 'body',
            mode: 'invisible',
            effect: 'slideUp'
        }, options || {});

        mode = o.mode;
        target = o.target;
        effect = o.effect;

        /**
         * filter elements to preload them
         */
        var $elements = $(this).find('*').filter(function () {
            var $el = $(this);

            if ($el.is('img') && $el.attr('src') !== '')
                return true;

            var bgImage = $el.css('background-image');

            if (bgImage.indexOf('gradient') != -1) return false;

            return (bgImage !== "none" && bgImage !== "");
        });

        count = $elements.size();

        if (count > 0) {
            if (mode != 'invisible' && mode != 'invisibleAll') {
                preLoadWay();
                unit = equalParts(count, $('.p_progress').width());
                unitPc = equalParts(count, 100);
            }

            return $elements.css({visibility: 'hidden'}).each(function (i) {
                loadOne($(this));

                if (!--i) {
                    if (mode === 'invisibleAll') {
                        $elements.css('visibility', 'visible');
                    } else if (mode !== 'invisibleAll' && mode !== 'invisible') {
                        showLoaded();
                    }

                    if (callback)
                        callback();
                }
            });
        }

        function loadOne($el) {
            var elBg = $el.css('background-image');

            var src = $el.attr('src');

            var background = false;
            if (!src && elBg != "none" && elBg != "") {
                background = true;
                src = elBg.substring(4, elBg.length - 1);

                /** fix for msie and moziilla browsers */
                if ($.browser.msie || $.browser.mozilla)
                    src = src.substring(1, src.length - 1)
            }
            console.log(src);
            var $elToLoad = ($.browser.msie || background) ? $('<img/>').attr('src', src) : $el

            $elToLoad.load(function () {
                if (mode !== 'invisibleAll') {
                    console.log('1');
                    $($el).css({visibility: 'visible'});

                    if (mode !== 'invisible') progressLoad();
                }

                count--;
            });
        }

        function progressLoad() {
            var progressBg = $('.p_progress_wrapper .progress');
            var progressPc = $('.p_progress_wrapper span.percents');

            var width = parseFloat(progressBg.width());

            if (count - 1 <= 0) {
                loadPercent += unitPc[1];
                progressBg.css({'width': width + unit[1] + 10});
            } else {
                loadPercent += unitPc[0];
                progressBg.css({'width': width + unit[0]});
            }
            progressPc.html(loadPercent + '%');
        }
    };

    function showLoaded() {
        var pCont = $('#p_container');
        if (pCont) {
            switch (effect) {
                case 'none':
                    progressDiv.find('span:first').html('Loading Done!');
                    break;
                case 'fadeOut':
                    pCont.fadeOut(3000, function () {
                        $(this).remove();
                    });
                    break;
                case 'slideUp':
                    pCont.slideUp(1000, function () {
                        $(this).remove();
                    });
                    break;
            }
        }
    }

    //how to show the loading process to a user
    function preLoadWay(fHSettings) {
        preloadDiv = $('<div id="p_container"/>');
        progressDiv = $('<div class="p_progress_wrapper"><div class="p_progress"><span>Loading</span><span class="percents">0%</span><div class="progress"></div></div></div>');

        var s = $.extend({width: '100%', height: '100%'}, fHSettings || {});

        var position = 'relative';

        if (mode == 'fullScreen') {
            position = 'fixed';
        }
        else if (mode == 'inside') {
            position = 'absolute';
        }


        $(target).css({
            'position': 'relative'
        }).append(preloadDiv);
        preloadDiv.append(progressDiv);
        preloadDiv.css({
            position: position,
            width: s.width,
            height: s.height
        })

    }

    //function for almost equal parts of any number per some pieces.
    function equalParts(quantity, max) {
        var result = new Array();
        var wholeNumber = parseInt(max / quantity);
        var lastElement = max - (wholeNumber * (quantity - 1));
        if (lastElement >= quantity) {
            wholeNumber += parseInt(lastElement / quantity);
            lastElement = max - wholeNumber * (quantity - 1);
        }
        result.push(wholeNumber, lastElement, quantity, max);

        return result;
    }
})(jQuery);
