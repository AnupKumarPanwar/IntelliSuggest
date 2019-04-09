suggest()

function suggest() {
    var $textObj = $('input:text')

    var $countSpan = $('<span>', { id: 'count' }).css('padding-left', '5px').text('')

    $textObj.on('input', function () {
        var size = 0
        var value = $textObj.val()
        for (var i = 0; i < value.length; i++) {
            size += unescape(encodeURIComponent(value[i])).length
        }
        var suggestion = '';
        $.get(
            "https://www.google.com/complete/search?q=" + value + "&cp=3&client=psy-ab",
            function (data) {
                if (data[1]) {
                    suggestion = data[1][0][0];
                    $('#count').text(suggestion)
                }
            }
        );
        $textObj.after($countSpan)
    });
}
