require('../css/highlight.css');
require('../css/style.css');
const hljs = require('./highlight.js');
const showdown = require('./showdown.js');
window.onload = function() {
  showdown.extension('codehighlight', function() {
    function htmlunencode(text) {
      return (
        text
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
        );
    }
    return [
      {
        type: 'output',
        filter: function (text, converter, options) {
          //use new shodown's regexp engine to conditionally parse codeblocks
          var left  = '<pre><code\\b[^>]*>',
              right = '</code></pre>',
              flags = 'g',
              replacement = function (wholeMatch, match, left, right) {
                // unescape match to prevent double escaping
                match = htmlunencode(match);
                return left + hljs.highlightAuto(match).value + right;
              };
          return showdown.helper.replaceRecursiveRegExp(text, replacement, left, right, flags);
        }
      }
    ];
  });
  var converter = new showdown.Converter({
    tables: true,
    openLinksInNewWindow: true,
    simplifiedAutoLink: true,
    extensions: ['codehighlight']
  });
  var pad = document.getElementById('pad');
  var markdownArea = document.getElementById('markdown');   

// make the tab act like a tab
  pad.addEventListener('keydown',function(e) {
    if (e.keyCode == 9) {
        e.preventDefault();              
        var start = this.selectionStart;
        var end = this.selectionEnd;
        var val = this.value;
        var selected = val.substring(start, end);
        var re, count;

        // let te = document.createEvent('TextEvent');
        // te.initTextEvent('textInput', true, true, null, val, 9, "en-US");
        // this.dispatchEvent(te);
        // TODO: this break browser undo stack
        if(e.shiftKey) {
            re = /^[ ]{2}/gm;
            if(selected.match(re)){
              count = -selected.match(re).length;
              this.value =  val.substring(0, start) + selected.replace(re, '') + val.substring(end);
            }
            // todo: add support for shift-tabbing without a selection
        } else {
            re = /^/gm;
            if(selected.match(re)){
              count = selected.match(re).length;
              this.value = val.substring(0, start) + selected.replace(re, '  ') + val.substring(end);
            }
        }

        if(start !== end) {
          this.selectionStart = start;
          this.selectionEnd = end + (count*2);
        }

    }
  });

  var convertTextAreaToMarkdown = function(){
    var markdownText = pad.value;
    const html = converter.makeHtml(markdownText)
      .replace(/~~([^~]+)~~/g,'<strike>$1</strike>')

    markdownArea.innerHTML = html;
  };

  pad.addEventListener('input', convertTextAreaToMarkdown);

  convertTextAreaToMarkdown();
};
