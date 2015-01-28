// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, document, undefined ) {
    // undefined is used here as the undefined global variable in ECMAScript 3 is
    // mutable (ie. it can be changed by someone else). undefined isn't really being
    // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
    // can no longer be modified.

    // window and document are passed through as local variable rather than global
    // as this (slightly) quickens the resolution process and can be more efficiently
    // minified (especially when both are regularly referenced in your plugin).

    // Create the defaults once
    var pluginName = "codeblock",
        defaults = {
          editable: true,
          consoleText: "",
		  consoleClass: "codeblock-console-text",
          runButtonText: "run",
          runButtonClass: "codeblock-console-run",
          console: true,
          resetable: true,
          runnable: true,
          editorTheme: "ace/theme/dawn",
          lineNumbers: true
        };

    // The actual plugin constructor
    function CodeBlock( element, options ) {
        this.element = element;
        this.original = $(this.element);
		this.enabled = true;

        // jQuery has an extend method which merges the contents of two or
        // more objects, storing the result in the first object. The first object
        // is generally empty as we don't want to alter the default options for
        // future instances of the plugin
        this.options = $.extend( {}, defaults, options );

        this._defaults = defaults;
        this._name = pluginName;
        this._exports = {
            "run": this.run,
            "reset": this.reset,
            "destroy": this.destroy,
            "editor": this.getEditor,
            "text": this.getSetText,
            "runnable": this.getSetRunnable,
            "editable": this.getSetEditable
        };

        this.init();
    }

    CodeBlock.prototype = {
        init: function() {
          this.setUpDom();
          this.setUpEditor();
          if (this.options.console) {
            this.createConsole();
          }
          if (this.options.resetable) {
            this.createResetButton();
          }
		  this.base.data("plugin_" + pluginName, this);
        },

        setUpDom: function() {
            
			this.base = this.original.clone();
			this.originalText=this.base.text();

			/*var lines=this.originalText.split("\n");
			console.log(this.originalText);
			var acc="";
			for(var i=0; i<lines.length; i++){
				acc=acc+"<div>"+lines[i]+"</div>";
			}
			console.log(acc);
			this.original.html(acc);
			

			this.original.html("<div>"+this.original.text()+"</div>");*/
			this.original[0].contentEditable=true;
        },

        setUpEditor: function() {
			
            
        },

        createConsole: function() {
			idConsole=this.base.attr('id')+"-console";
			
			console_wrapper=$("#"+idConsole);
			
			if (this.options.runnable) {
				this.runButton = $("<span></span>").addClass("codeblock-console-run");
				this.runButton.text(this.options.runButtonText);

				var cur = this;
				this.runButton.click(function() {
				  if (cur.enabled) {
					  cur.run();
				  }
				});
				console_wrapper.append(this.runButton);
			}
				
			this.console=$("<span></span>").addClass("codeblock-console-text");
			console_wrapper.append(this.console);
			this.console.text(this.options.consoleText);
			this.console.addClass("placeholder");
           
        },

        createResetButton: function() {
            var reset_button = $("<i></i>").addClass("codeblock-reset").attr("title", "Reset");

            var cur = this;
            reset_button.click(function() {
              cur.reset();
              return false;
            });
            this.base.after(reset_button);
        },

		destroy: function() {
			this.editor.destroy();
			this.editor = undefined;
			this.options = undefined;
			this.originalText = undefined;
			this.console = undefined;
			this.runButton = undefined;

			this.original.insertBefore(this.el);
			$.removeData(this.element, "plugin_" + pluginName);
			this.base.removeData("plugin_" + pluginName);

			this.base.remove();
			this.base = undefined;
			this.el.remove();
			this.el = undefined;
		},

        run: function() {
		    this.base.add(this.original).trigger("codeblock.run");

            var val = this.original.text();
            //clear text
            this.console.text('');
            this.console.removeClass("placeholder");
            var cur = this;
            //closure to overload console
            (function(){
                var c = {};
                c.log = function() {
                    var text = $.makeArray(arguments).join(" ");
                    var currText = cur.console.html();
                    currText += text + "<br/>";
                    cur.console.html(currText);
					cur.base.add(cur.original).trigger("codeblock.console", [text]);
                };
                try {
                    //To catch returns & exceptions
                    //NOTE - this must be minified "by hand" to make sure that
                    //the variable named "console" is preserved
                    //Depending on your minifier, you may be able to set javascript
                    //comment flags to tell the minifier not to compile this
                    (function(console){eval(val);})(c);
                } catch (err) {
                    c.log("Error:", err);
                }
            })();

		    return this;
        },

        reset: function() {
          this.base.add(this.original).trigger("codeblock.reset");

          this.editor.setValue(this.originalText);
          this.editor.clearSelection();
          this.editor.navigateFileStart();
          this.console.text(this.options.consoleText);
          this.console.addClass('placeholder');

		  return this;
        },

    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations and allowing for
    // jquery-ui like method calls
    $.fn[pluginName] = function () {
		if (arguments.length === 0 || (arguments.length == 1 && typeof arguments[0] === "object")) {
			//constructor
			var options = arguments[0];
            return this.each(function(){
                var codeblock = $.data(this, "plugin_" + pluginName);
				if (!codeblock) {
                    codeblock = new CodeBlock( this, options );
					$.data(this, "plugin_" + pluginName, codeblock);
				}
			});
		} else {
			//action (i.e. $(".blah").codeblock('run');
			var action = arguments[0];
			var params = Array.prototype.slice.call(arguments, 1);
            var ret = this.map(function(){
				var codeblock = $.data(this, "plugin_" + pluginName);
				if (codeblock) {
					var method = codeblock._exports[action];
					if (!method) { throw "Codeblock has no method "+action;}
					return method.apply(codeblock, params);
				}
			}).get();

            //return "this" for everything but the getters
            if (action === "editor" || (params.length ===0 && (action == "runnable" || action == "editable"))) {
                return ret.length >= 1 ? ret[0] : undefined;
            } else if (params.length === 0 && action == "text") {
                return ret.join();
            } else {
                return this;
            }
		}
    };
})( jQuery, window, document );
