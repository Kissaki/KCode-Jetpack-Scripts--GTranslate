/* import jetpack modules */
const contextMenu = require("context-menu");
const request = require("request");
const simpleStorage = require("simple-storage");
/* constants */
const gTranslateUrl = 'http://ajax.googleapis.com/ajax/services/language/translate?v=1.0&q=';

/* functions */
function getTUrl(text, langto) {
  return gTranslateUrl + escape(text) + '&langpair=%7C' + escape(langto);
}
/* vars */
var langTo = (simpleStorage.storage.langTo != undefined ? simpleStorage.storage.langTo : 'en');


/* context menu – GTranslate!-item */
var tItem = contextMenu.Item({
  label: "GTranslate!",
  'context': '*',
  onClick: function(contextObj) {
    var selection = require('selection');
    if (selection.text == null) {
      var node = contextObj.node;
      var textBefore = node.innerHTML;
      var req = request.Request({
        'url': getTUrl(textBefore, langTo),
        'onComplete': function() {
          node.innerHTML = this.response.json.responseData.translatedText;
        }
      });
    }
    else {
      var req = request.Request({
        'url': getTUrl(selection.text, langTo),
        'onComplete': function() {
          selection.text = this.response.json.responseData.translatedText;
        }
      });
    }
    req.get();
  }
});

/* context menu – language selection */
var langs = ["af", "ar", "az", "be", "bg", "ca", "cs", "cy", "da", "de", "el", "en", "es", "et", "eu", "fa", "fi", "fr", "ga", "gl", "hi", "hr", "ht", "hu", "hy", "id", "is", "it", "iw", "ja", "ka", "ko", "lt", "lv", "mk", "ms", "mt", "nl", "no", "pl", "pt", "ro", "ru", "sk", "sl", "sq", "sr", "sv", "sw", "th", "tl", "tr", "uk", "ur", "vi", "yi", "zh-CN", "zh-TW"];
var items = [];
for (i in langs) {
  let targetLang = langs[i];
  items[items.length] = contextMenu.Item({
    label: langs[i],
    onClick: function(contextObj) {
      langTo = targetLang;
      if (!require("private-browsing").active) {
        simpleStorage.storage.langTo = targetLang;
      }
    }
  });
}

/* context menu – actually add menu */
var tMenu = contextMenu.Menu({
  'label': "GTranslate",
  'context': '*',
  'items': [
    tItem,
    contextMenu.Menu({
      'label': "Change TargetLanguage",
      'context': '*',
      'items': items
    })
  ]
});
contextMenu.add(tMenu);

