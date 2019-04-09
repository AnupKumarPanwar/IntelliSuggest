suggest();

function suggest() {
  var $suggestionSpan = $("<span>", { id: "suggestion" })
    .css("padding", "5px")
    .css("position", "fixed")
    .css("background", "#00aabb")
    .css("border-radius", ".4em")
    .css("color", "#fff")
    .css("top", "0px")
    .css("text-align", "center")
    .css("width", "100%")
    .css("left", "0px")
    .text("");
  var sentence = "";

  $("input:text, textarea, [contenteditable]").focus(function() {
    var $textObj = $(this);
    sentence = "";
    var previousSentence = "";
    var suggestion = "";
    var delimeters = [".", "?", "!"];
    $("#suggestion").html(suggestion);

    $textObj.on("input", function() {
      var value;

      if ($textObj.is("[contenteditable]")) {
        value = $textObj.text();
      } else {
        value = $textObj.val();
      }
      var last = 0;
      for (i in delimeters) {
        var delimeter = delimeters[i];
        var pos = value.lastIndexOf(delimeter);
        if (pos > last) {
          last = pos;
        }
      }

      if (last + 1 >= value.length) {
        sentence = "";
        $("#suggestion").html("");
      } else {
        if (last == 0) {
          sentence = value.substring(last, value.length);
          previousSentence = value.substring(0, last);
        } else {
          sentence = value.substring(last + 1, value.length);
          previousSentence = value.substring(0, last + 1);
        }
      }

      $.get(
        "https://www.google.com/complete/search?q=" +
          sentence +
          "&cp=11&client=psy-ab&authuser=0",
        function(data) {
          if (data[1]) {
            suggestion = data[1][0][0];
            $("#suggestion").html(suggestion);
          }
        }
      );
    });

    $textObj.on("unfocus", function() {
      suggestion = "";
      $("#suggestion").html(suggestion);
    });

    $textObj.on("keydown", function(e) {
      var keyCode = e.keyCode || e.which;
      if (keyCode == 9) {
        if ($("#suggestion").html() != "") {
          e.preventDefault();

          var formattedText = unescape(suggestion);
          formattedText = formattedText.replace(/<b>/g, "");
          formattedText = formattedText.replace(/<\/b>/g, "");
          formattedText = unescape(formattedText);

          var div = document.createElement("div");
          div.innerHTML = formattedText;
          formattedText = div.innerText || div.textContent || "";

          formattedText =
            formattedText[0].toUpperCase() +
            formattedText.substring(1, formattedText.length);
          var completeText = previousSentence + " " + formattedText;
          completeText = completeText.trim();

          $textObj.val(completeText);

          $("#suggestion").html("");
        }
      } else if (keyCode == 27) {
        suggestion = "";
        $("#suggestion").html("");
      }
    });

    $textObj.after($suggestionSpan);
  });
}
