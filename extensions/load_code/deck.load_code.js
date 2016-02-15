/*
  This module allows javascript code blocks to be loaded from a 
  file. It doesn't really need to be a deck.js extension.
*/
(function($, undefined) {
    var $document = $(document);

	function skipString(str, index)
	{
	    var start=str[index];
	    console.log("  skipString : "+index+", start="+start);
	    
	    
	    var i=index+1;
	    while(1){
		b=str.indexOf("\\",i);
		if(b==-1)
		    break;
		i=b+2;
	    }
	    
	    m=str.indexOf(start,i);
	    if(m==-1)
		return str.length;
	    return m+1;
	}
	
	function skipLineComment(str,index)
	{
	    if(str.substring(index,index+2)!="//")
		return str.length;
	    var m=index;
	    while(m<str.length && str.charAt(m)!='\n'){
		m=m+1;
	    }
	    
	    return m+1;
	}
	
	function skipBlockComment(str,index)
	{
	    if(str.substring(index,index+2)!="/*")
		return str.length;
	    var m=str.indexOf("*/",index+2);
	    if(m==-1)
		return str.length;
	    return m+2;
	}
	
	/* Curly brackets must be perfectly nested in valid javascript. Exceptions
	   are curly brackets in strings, and in comments. */
	function skipCurly(str, index)
	{
	    console.log("skipCurly - Enter "+ index);

	    var enter="{[(";
	    var exit ="}])";
	    
	    var curr=index;

	    var first=str[curr];
	    var ss=enter.indexOf(first);
	    if(ss==-1){
		Console.log("skipCurly - must start with on of "+enter);
		return str.length;
	    }
	    var last=exit[ss];
	    
	    curr=curr+1;
	    while(1){
		//console.log("  "+curr + " = "+str[curr]);
		if(curr >= str.length)
		    break;
		if(str[curr]==last){
		    return curr+1;
		}
		
		if(str[curr]==first){
		    curr=skipCurly(str,curr);
		}else if(str[curr]=="\"" || str[curr]=="\'"){
		    nCurr=skipString(str,curr);
		    console.log("  skipped string @"+str.substring(curr,nCurr)+"@");
		    curr=nCurr;
		}else if(str[curr]=="/"){
		    console.log("  first slash");
		    if(str[curr+1]=="/"){
			nCurr=skipLineComment(str,curr);
			console.log("  skipped line comment @"+str.substring(curr,nCurr)+"@");
			curr=nCurr;
		    }else if(str[curr+1]=="*"){
			curr=skipBlockComment(str,curr);
		    }else{
			curr=curr+1;
		    }
		}else{
		    curr=curr+1;
		}
	    }
	    return str.length;
	}

    function extractFunction(src,name)
    {	

	var regex=new RegExp("function[ ]+"+name+"[ ]*[(]","g");
	var m=src.search(regex)
	if(m==-1){
	    console.log("No such function : "+name);
	    return src;
	}
	
	console.log("Found "+name+" at "+m);
	
	var start=m;
	var curly=src.indexOf("{",m);
	console.log("Body at "+curly);
	var end=skipCurly(src,curly);
	//var end=start+10;
	
	return src.substring(start,end);
    };

    function extractVariable(src,name)
    {	

	var regex=new RegExp("var[ ]+"+name+"[ ]*=","g");
	var m=src.search(regex)
	if(m==-1){
	    console.log("No such variable with definition : "+name);
	    return src;
	}
	
	console.log("Found variable at "+m);
	
	var start=m;
	var equals=src.indexOf("=",start);
	var endRegex=new RegExp("[[]|[(]|[{]|;");
	var curly=src.search(endRegex,m);
	if(curly==-1){
	    end=src.length;
	}else if(src[curly]==";"){
	    end=curly+1;
	}else{
	    console.log("  Variable Body at "+curly);
	    end=skipCurly(src,curly);
	    ee=src.indexOf(";",end);
	    if(ee!=-1)
		end=ee+1;
	    console.log("  Finished at "+end);
	}
	//var end=start+10;
	
	return src.substring(start,end);
    };

    function loadJavascriptThingsFromFile(containerSel, srcFile, thingName, thingGetter)
    {
	$(function(){
	    var container=$(containerSel);
	    $.ajax(srcFile, {
		converters: { // This stops the script being evaluated in the global scope, where it might overwrite other functions
		    'text script': function (text) {
			eval(text); // Evaluate text locally so that we get still get syntax check
			return text;
		    }
		},
		error : function(jqXHR, textStatus, errorThrown){
		    container.html("Error : Couldn't load '"+srcFile+"'<br/> textStatus = "+textStatus+"<br/> errorThrown="+errorThrown);	
		},
		success :function( data ) {
		    var target=$("<pre/>");

		    var names;
		    if($.type(thingName)=="string"){
			names=[thingName];
		    }else{
			names=thingName;
		    }
		    
		    var func=null;
		    for(var i=0;i<names.length;i++){
			if(func)
			    func=func+"\n\n";
			else
			    func="";
			func=func+thingGetter(data, names[i]);
		    }
		    target.text(func);
		    target.addClass("brush:javascript").addClass("gutter:false");
		    
		    		    
		    target.appendTo(container);

		    var link=$("<a/>", {
			text:srcFile,
			href:srcFile
		    });
		    link.appendTo(container);

		    
		    // Because we load asynchronously, we have to call highlight again.
		    SyntaxHighlighter.highlight();
		}
	    })
	});
    }

    $.fn.extend({
	loadJavascriptFunctionFromFile : function(srcFile, functionName){
	    return this.each(function() {
		loadJavascriptThingsFromFile(this, srcFile, functionName,extractFunction);
	    });
	},
	loadJavascriptVariableFromFile : function(srcFile, variableName){
	    return this.each(function() {
		loadJavascriptThingsFromFile(this, srcFile, variableName, extractVariable);
	    });
	}
    });
})(jQuery, 'deck');

