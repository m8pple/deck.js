// Based on http://niftybits.wordpress.com/2012/01/09/a-syntax-highlighter-extension-for-deck-js/

/* DT10: Hacked up to bring in local copies of SyntaxHighlighter. Should really be configurable,
currently has a fixed absolute prefix. */

(function ($) {
    $("head").append(
    /*'<link href="http://alexgorbatchev.com/pub/sh/current/styles/shCore.css" rel="stylesheet" type="text/css" />'*/
    '<link href="/resources/deck.js/extensions/syntaxhighlighter/SyntaxHighlighter/shCore.css" rel="stylesheet" type="text/css" />'
    ).append(
    /*'<link href="http://alexgorbatchev.com/pub/sh/current/styles/shThemeDefault.css" rel="stylesheet" type="text/css" />'*/
    '<link href="/resources/deck.js/extensions/syntaxhighlighter/SyntaxHighlighter/shThemeDefault.css" rel="stylesheet" type="text/css" />'
    ).append(
    /* DT10 : Stop scroll-bars appearing in chrome:
        http://yaseminavcular.blogspot.co.uk/2011/04/remove-unnecessary-scrollbar-from.html
    */
    '<style type="text/css">.syntaxhighlighter { overflow-y: hidden !important; }</style>'
    );
    function setupSyntaxHighlighterAutoloads() {
        console.log("calling SyntaxHighlighter");
        SyntaxHighlighter.autoloader(
              'bash shell             /resources/deck.js/extensions/syntaxhighlighter/SyntaxHighlighter/shBrushBash.js',
              'cpp c                  /resources/deck.js/extensions/syntaxhighlighter/SyntaxHighlighter/shBrushCpp.js',
              'java                   /resources/deck.js/extensions/syntaxhighlighter/SyntaxHighlighter/shBrushJava.js',
              'js jscript javascript  /resources/deck.js/extensions/syntaxhighlighter/SyntaxHighlighter/shBrushJScript.js',
              'text plain             /resources/deck.js/extensions/syntaxhighlighter/SyntaxHighlighter/shBrushPlain.js',
              'py python              /resources/deck.js/extensions/syntaxhighlighter/SyntaxHighlighter/shBrushPython.js',
              'xml xhtml xslt html    /resources/deck.js/extensions/syntaxhighlighter/SyntaxHighlighter/shBrushXml.js'
       );
       SyntaxHighlighter.defaults['toolbar'] = false;
       SyntaxHighlighter.defaults['tab-size'] = 2;
       SyntaxHighlighter.all();
    }
    $.getScript("/resources/deck.js/extensions/syntaxhighlighter/SyntaxHighlighter/shCore.js",
        function () {
            $.getScript("/resources/deck.js/extensions/syntaxhighlighter/SyntaxHighlighter/shAutoloader.js",setupSyntaxHighlighterAutoloads);
    });
})(jQuery);
