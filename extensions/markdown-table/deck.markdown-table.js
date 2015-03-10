(function($, deck, undefined) {
    $(document).bind('deck.init', function() {
        var container = $[deck]('getContainer');

        $('.markdown-table', container).each(function() {
            var src=$(this).html();
            var table=$('<table class="markdown-table-output" style="text-align:center"></table>');
            var header=true;
            var lines=src.split("\n");
            for(var i=0; i<lines.length; i++){
                var line=lines[i];
                if(line.length==0){
                    continue;
                }else if(line.match(/^[-]+([|][-]+)/)){
                    header=false;
                }else{
                    var row=$("<tr></tr>");
                    var cols=line.split("|");
                    for(var j=0; j<cols.length; j++){
                        var col;
                        if(header){
                            col=$("<th></th>");
                        }else{
                            col=$("<td></td>");
                        }
                        col.html(cols[j].trim());
                        row.append(col);
                    }
                    table.append(row);
                }
            }
            $(this).html("");
            $(this).append(table);
        });

        //$(".markdown-table-output tr td").attr("width","6%");
    });

})(jQuery, 'deck');
