(function ($) {
    $.fn.imagePreloader = function (callback) {
        /** filter elements to preload them */
        var $elements = $(this).find('*').filter(function () {
            var $el = $(this);

            if ($el.is('img') && $el.attr('src') !== '') return true;

            var bgImage = $el.css('background-image');
            if (bgImage.indexOf('gradient') != -1) return false;

            return (bgImage !== "none" && bgImage !== "");
        });

        var count = $elements.size();

        function load($el) {
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

            $('<img>')
                .on('load', function () {
                    // image exists and is loaded
                    count--;
                    if (count <= 0) afterAllElementsLoaded();
                })
                .on('error', function () {
                    count--;
                    if (count <= 0) afterAllElementsLoaded();
                })
                .attr('src', src);
        }

        function afterAllElementsLoaded() {
            $elements.css('visibility', 'visible');
            if (callback) callback();
        }

        if (!count && callback)
            callback();

        return $elements.css({visibility: 'hidden'}).each(function () {
            load($(this));
        });
    };
})(jQuery);
