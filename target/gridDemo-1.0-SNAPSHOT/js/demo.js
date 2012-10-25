$("document").ready(function(){
    
    $("#start").click(function(){
        
        var url = "pages/" + $(this).attr("href") ;
        
        $.get(url, {}, function(data){
            
            $(data).appendTo($(".griddemo").empty());
            
            $(".gridContainer").hdgrid({
                url: 'jsonData.html',
                showColNum: true,
                checkBox: false,        
                showPage: true,
                autoLoad: true,
                colModel: [
                    {name: 'id', header: '主键'} ,
                    {name: 'company', header: 'company', sortable: true} ,
                    {name: 'price', header: 'price'},
                    {name: 'change', header: 'change'},
                    {name: 'pctChange', header: 'pctChange'},
                    {name: 'lastChange', header: 'lastChange', hidden: false, formatter: function(val){
                            return dateFomatter(val);
                    }}
                ]
            });            
            
            
        }, 'text');
        
        return false;
        
    })
    
    $("#event").click(function(){
        var url = "pages/" + $(this).attr("href") ;
        $.get(url, {}, function(data){
            
            $(data).appendTo($(".griddemo").empty());
            
            $(".gridContainer").hdgrid({
                url: 'jsonData.html',
                showColNum: true,
                checkBox: false,        
                showPage: true,
                autoLoad: true,
                rowclick: rowClick,
                rowdblclick: rowdblclick,
                colModel: [
                    {name: 'id', header: '主键'} ,
                    {name: 'company', header: 'company', sortable: true} ,
                    {name: 'price', header: 'price'},
                    {name: 'change', header: 'change'},
                    {name: 'pctChange', header: 'pctChange'},
                    {name: 'lastChange', header: 'lastChange', hidden: false, formatter: function(val){
                            return dateFomatter(val);
                    }}
                ]
            });            
            
        }, 'text');
        
        return false;      
        
    })
    
    $("#column").click(function(){
        var url = "pages/" + $(this).attr("href") ;
        $.get(url, {}, function(data){
            
            $(data).appendTo($(".griddemo").empty());           
            
        }, 'text');
        
        return false;
    });   
    
    $("#rowselect").click(function(){
        
        var url = "pages/" + $(this).attr("href") ;
        
        $.get(url, {}, function(data){
            
            $(data).appendTo($(".griddemo").empty()); 
            
            $(".gridContainer").hdgrid({
                url: 'jsonData.html',
                showColNum: true,
                checkBox: true,        
                showPage: true,
                autoLoad: true,
                colModel: [
                    {name: 'id', header: '主键'} ,
                    {name: 'company', header: 'company', sortable: true} ,
                    {name: 'price', header: 'price'},
                    {name: 'change', header: 'change'},
                    {name: 'pctChange', header: 'pctChange'},
                    {name: 'lastChange', header: 'lastChange', hidden: false, formatter: function(val){
                            return dateFomatter(val);
                    }}
                ]
            });               
            
            $("#getsrows").click(function(){
                alert("select " + $(".gridContainer").getSelectRow().length  + " rows");
            })

            $("#selectrows").click(function(){
                $(".gridContainer").selectRows([{name:'company', value: 'company1'}]);
            })              
            
        }, 'text');
        
        return false;       
        
    })
    
    $("#search").click(function(){
        var url = "pages/" + $(this).attr("href") ;
        $.get(url, {}, function(data){
            
            $(data).appendTo($(".griddemo").empty());           
            
        }, 'text');
        
        return false;
    })
    
    var rowClick = function(rData){
        alert("click row id = " + rData.id);
    }	
    var rowdblclick = function(rData){
        alert("dblckick row id = " + rData.id);
    }	
    var rowmousedown = function(rData){
        alert("rowmousedown row id = " + rData.id);
    }	      
    
})

function dateFomatter(millions){
    if(!millions && millions != 0)
        throw "param is null"
    if(millions !== +millions)
        throw "param is not Number";
    var date = new Date();
    date.setTime(millions);
    var year = date.getFullYear();
    var month = date.getMonth();
    var day = date.getUTCDate();
    var hour = date.getHours();
    var min = date.getMinutes();
    var sec = date.getSeconds();
    
    return year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec;
}