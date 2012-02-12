
This repository is a merge of:

- the main deck.js project
- the deck.ext.js extension project
- my updates to these


#deck.js

A JavaScript library for building modern HTML presentations. deck.js is flexible enough to let advanced CSS and JavaScript authors craft highly customized decks, but also provides templates and themes for the HTML novice to build a standard slideshow.

## Dependencies (included in this repository)

- [jQuery](http://jquery.com)
- [Modernizr](http://modernizr.com)

## Documentation

Check out the [documentation page](http://imakewebthings.github.com/deck.js/docs) for more information on the methods, events, and options available in core and all the included extensions.  A sample standard slide deck is included in the package under the `introduction` folder.  You can also [view that sample deck](http://imakewebthings.github.com/deck.js/introduction) online to play with the available style and transition themes.

## Extensions, Themes, and Related Projects

Take a look at [the wiki](https://github.com/imakewebthings/deck.js/wiki) for lists of extensions, themes, and other related goodies.  If you have a publicly available project of your own, feel free to add to the list.

## Tests & Support

Unit tests are written with [Jasmine](http://pivotal.github.com/jasmine/) and [jasmine-jquery](https://github.com/velesin/jasmine-jquery). You can [run them here](http://imakewebthings.github.com/deck.js/test).

deck.js has been tested with jQuery 1.6+ and works in IE7+, Chrome, FF, Safari, and Opera. The more capable browsers receive greater enhancements, but a basic cutaway slideshow will work for all browsers listed above. Please don't give your presentations in IE6.

For any questions or general discussion about deck.js please direct your attention to the [mailing list](http://groups.google.com/group/deckjs) (uses Google groups.)  If you would like to report a bug, please see the [issues page](https://github.com/imakewebthings/deck.js/issues).

## Known Bug(s)

There is an issue with certain builds of Chrome that result in a solid blue background and generally broken decks.  This is a bug in Chrome ([Issue 91518](http://code.google.com/p/chromium/issues/detail?id=91518)) that stems from hardware acceleration of 3d transforms.  Current workarounds:

- Use a different browser. This problem doesn't exist in Safari, FF, Opera.
- Disable hardware compositing by setting `--disable-accelerated-compositing` in the Chrome loading options
- Replace instances of `translate3d` with `translate` in the CSS of your decks (though this will slow down performance on iOS devices and Safari.)

## Printing

Core includes stripped down black and white print styles for the standard slide template that is suitable for handouts.

## Awesome Contributors

- [jbuck](https://github.com/jbuck)
- [cykod](https://github.com/cykod)
- [dougireton](https://github.com/dougireton)
- [awirick](https://github.com/awirick)
- Daniel Knittl-Frank
- [alexch](https://github.com/alexch)

If you would like to contribute a patch to deck.js please do as much as you can of the following:

- Add or amend Jasmine tests.
- Add inline documentation.
- If the standard snippet of an extension changes, please change it in both the introduction deck and the snippet html in the extension folder.
- If the API changes, it would be awesome to receive a parallel pull request to the gh-pages branch which updates the public-facing documentation.

## License

Copyright (c) 2011 Caleb Troughton

Dual licensed under the [MIT license](https://github.com/imakewebthings/deck.js/blob/master/MIT-license.txt) and [GPL license](https://github.com/imakewebthings/deck.js/blob/master/GPL-license.txt).




#deck.ext.js

Deck.ext.js provides a set of extensions, themes and use cases for the deck.js framework.
Deck.js is a JavaScript library for building modern HTML presentations which is flexible enough to let advanced CSS and JavaScript authors craft highly customized decks, but also provides templates and themes for the HTML novice to build a standard slideshow.

Currently Deck.ext.js provides the following extensions:

- deck.toc.js, provides a support for TOC,
- deck.asvg.js, provides a support for including and animating SVG images,
- deck.clone.js, provides a support for cloning a deck presentation to another window,
- deck.notes.js, provides a support for adding and viewing speaker notes.

Currently Deck.ext.js provides the following themes:

- beamer, aims to provides a team similar to the Latex beamer

I'll soon provide an illustration on how to use deck.toc.js together with the beamer themes. 

##deck.toc.js extension

This extension provides the support for TOC within the deck.js framework.

### General Idea

The `deck.toc.js` extension uses the H* tags to build the TOC.

- H1 represents the title of the presentation
- H2 corresponds to a section
- H3 corresponds to a subsection
- H4 corresponds to a subsubsection

The TOC is automatically constructed when `deck.init` is called, and pressing
on `t` will toggle the TOC panel.

Elements in the TOC panel are clickable and thus it provides another way
to navigate easily in the slides.

### Example

The following:

        <section class="slide" id="title-slide">
            <h1>The Presentation Title</h1>
        </section>

        <section class="slide">
            <h2>Section 1</h2>
            <p>If you want to learn about making your own themes, extending deck.js, and more, check out the&nbsp;<a href="../docs/">documentation</a>.</p>
        </section>

        <section class="slide">
            <h3>Section 1.1</h3>
            <p>If you want to learn about making your own themes, extending deck.js, and more, check out the&nbsp;<a href="../docs/">documentation</a>.</p>
        </section>

        <section class="slide">
            <h3>Section 1.2</h3>
            <p>If you want to learn about making your own themes, extending deck.js, and more, check out the&nbsp;<a href="../docs/">documentation</a>.</p>
        </section>

        <section class="slide">
            <h2>Section 2</h2>
            <p>If you want to learn about making your own themes, extending deck.js, and more, check out the&nbsp;<a href="../docs/">documentation</a>.</p>
        </section>

        <section class="slide">
            <h2>Section 3</h2>
            <p>If you want to learn about making your own themes, extending deck.js, and more, check out the&nbsp;<a href="../docs/">documentation</a>.</p>
        </section>

will build the following TOC:

- The Presentation Title
    - Section 1
        - Section 1.1
        - Section 1.2
    - Section 2
    - Section 3

##deck.asvg.js extension

The `deck.asvg.js` extension (for Animated SVG) allows users to add animated schema into their presentation.

TO DETAIL THIS SECTION

##deck.clone.js extension

**ONLY TESTED WITH CHROMIUM and CHROME browser**

The `deck.clone.js` extension allows users to clone a deck presentation so that a clone of this presentation appears in a separate popup window.
The `deck.change` events of the master presentation are propagated to the cloned windows, so that when you navigate between the slides in the master window the navigation will operate nicely in the all the cloned windows. 
The advantage of cloning a deck presentation is that, on the master window you have the slides displayed while in the cloned window you have the speaker notes displayed.
The speaker notes can be displayed by using the `deck.notes.js` extension.

To clone a deck presentation just press `c`.

##deck.notes.js extension

The `deck.notes.js` extensions allows users to toggle speaker notes display by pressing the `n` key.
To add a note to a slide just add a simple div with a .notes class like below:

        <section class="slide" id="title-slide">
            <h1>The Presentation Title</h1>
        </section>

        <section class="slide">
            <h2>Section 1</h2>
            <p>If you want to learn about making your own themes, extending deck.js, and more, check out the&nbsp;<a href="../docs/">documentation</a>.</p>
            <div class="notes">
            This slide has speaker notes.
            </div>
        </section>

        <section class="slide">
            <h3>Section 1.1</h3>
            <p>If you want to learn about making your own themes, extending deck.js, and more, check out the&nbsp;<a href="../docs/">documentation</a>.</p>
        </section>

        <section class="slide">
            <h3>Section 1.2</h3>
            <p>If you want to learn about making your own themes, extending deck.js, and more, check out the&nbsp;<a href="../docs/">documentation</a>.</p>
            <div class="notes">
            This slide has speaker notes too.
            </div>
        </section>

This extension is better used together with the `deck.clone.js` extension.
