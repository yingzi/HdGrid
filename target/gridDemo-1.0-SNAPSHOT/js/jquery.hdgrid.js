/*
 * JQuery hdgrid core 0.2
 * 
 * Author by yingzi zhu
 *
 * 2012-07-20
 * 
 * 增加colmodel的formatter函数。用于数据初始化时，改变显示。如1现在在线0显示离线
 *
 * 增加设置表格参数、外部查询、表格重新加载函数、表格重画 2012-08-10
 * 
 * 增加设置表格的隐藏列。新增colmodel的 hidden属性 2012-08-13
 * 
 * 增加列名对象支持。如后台返回一个对象User. 可以在colmodel里面配置name为User.name来只显示用户名 2012-08-17
 * 
 * 修改如果属性值为null则页面显示为 ""， 如果表单未设置URL值。则不请求数据 2012-08-22
 * 
 * 添加行头排序功能 在页面的colmodel中配置sortabble属性。即可跟据改字段排序。如{name: 'id', header: '终端编号', sortable: true}  2012-08-23
 * 
 * 修改表格数据重加载。附带上查询的参数。 修改所有的请求，添加附带参数的判断。调用同一的全局参数 postData 2012-08-24
 * 
 * 修改表单页码跳转BUG 添加加载静态数据功能2012-08-27
 * 
 * 修改分页跳转、一个页面多个grid数据加载异常、修复showpage 为false时 分页栏的高度依旧存在的BUG、修复后端返回数据为null时的报错 2012-08-28
 * 
 * 修改一个页面多表共存的问题。修复了多表情况下数据加载异常、grid事件异常、grid刷新异常等问题。添加选中行接口 2012-08-29
 * 
 */

(function($){
    var ps = {};
    $.fn.hdgrid = function(setting){
        if($(this).length == 1){
            $.addhdgrid($(this), setting);
        }else{
            $.addhdgrid(setting);
        }
    }
    
    $.addhdgrid = function(t, setting){
        var id = $(t).attr("id");
        
        ps[id] = $.extend({
            showColNum: false,
            checkBox: false,
            showPage: false,
            autoLoad: true,
            target: t,
            renderTo: $(document.body)
        }, setting);  
        
        $.fn.setGridParam = function(newParams){
            if($(this).length == 1){
                $.extend(true, ps, newParams);
            }            
        }
        
        $.fn.setPostData = function(postData){
            if($(this).length == 1){                
                var tid = $(this).attr('id');
                var cuttentPs = ps[tid];
                cuttentPs.postData = postData;
                cuttentPs.postData['pageNo'] =  1;
                cuttentPs.postData['pageSize'] =  20;                

                if(cuttentPs.url){
                    $.post(cuttentPs.url, cuttentPs.postData, function(data, ex){
                        if(ex){
                            g.addData(data, ps, tid);
                        }
                    })                    
                }	                
            }
        } 

        $.fn.resize = function(){
            var tid = $(this).attr('id');
            var cuttentPs = ps[tid];            
            var trs = cuttentPs.target.find(".tbody tbody tr");
            var pages = cuttentPs.target.find("#page").html();
            cuttentPs.renderTo.empty();      
            var autoLoad = ps.autoLoad;
            cuttentPs.autoLoad = false            
            $.fn.drawtable(t, ps, tid);
            cuttentPs.renderTo.find(".tbody tbody").append(trs);
            cuttentPs.renderTo.find("#page").empty().append(pages);
            $.fn.initEvent(Number($(this).find(".totalRecord").text()), ps, tid);
        }
        
        $.fn.selectRows = function(tdData){
            if(!tdData || $(this).length === 0){
                return;                
            }
            var tid = $(this).attr('id');
            var tds = ps[tid].target.find("#content td");
            var trs = ps[tid].target.find("#content tr");
            trs.removeClass('trselect');
			trs.find(":checkbox").attr("checked", false);
            for(var i = 0; i < tds.length; i++){
                for(var j = 0; j < tdData.length; j++){
                    if($(tds[i]).attr("name") === tdData[j].name){
                        //如果选中
                        if($(tds[i]).text() == tdData[j].value){
                            $(tds[i]).parents('tr').eq(0).addClass('trselect').find(':checkbox').trigger('click').parents("tr").eq(0).addClass("trselect");
                        }
                    }
                }
            }
        }
        
        $.fn.loadData = function(){
            var tid = $(this).attr('id');
            var cuttentPs = ps[tid];              
            if(!cuttentPs.url){
                return;
            }
            if(!cuttentPs.postData){
                cuttentPs.postData = {
                    pageNo: 1,
                    pageSize: 20
                }
            }else{
                cuttentPs.postData['pageNo'] =  1;
                cuttentPs.postData['pageSize'] =  20;
            }
            
            $.post(cuttentPs.url, cuttentPs.postData, function(data, ex){
                if(ex){
                    g.addData(data, ps, tid);
                }
            })                     
        }
        
        $.fn.initEvent = function(total, targetPs, targetId){
            var TimeFn = null;
            var currentPs = targetPs[targetId];
            //行排序
            $("th[type=thsort]").click(function(){    
                if(!currentPs.postData){
                    currentPs.postData = {
                        pageNo: 1,
                        pageSize: 20
                    }
                }else{
                    currentPs.postData['pageNo'] =  1;
                    currentPs.postData['pageSize'] =  20;
                }                
                
                $.post(currentPs.url, currentPs.postData, function(data, ex){
                    if(ex){
                        g.addData(data, targetPs, targetId);
                    }
                })                     
            })            
                    
            $("#scrollTable .tbody tr").unbind('click').click(function(e){
                var td = $(this).find("td");
                if(currentPs.checkBox){
                    if(td.find(":checkbox").attr("checked") === 'checked'){
                        $(this).removeClass("trselect");
                        td.find(":checkbox").attr("checked", false);
                    }else{
                        $(this).addClass("trselect");
                        td.find(":checkbox").attr("checked", true);                            
                    }                            
                }else{
                    $("#scrollTable .tbody tr").removeClass("trselect");
                    $(this).addClass("trselect");
                }
                        
                clearTimeout(TimeFn);

                TimeFn = setTimeout(function(){
                    var rData = new Object();
                    for(var i = 0; i < td.length; i++){
                        var value = $(td[i]).text();
                        var attr = $(td[i]).attr("name");
                        rData[attr] = value;
                    }
                    if(currentPs.rowclick){
                        return currentPs.rowclick(rData);
                    }
                            
                },300);
            })                        
                    
            if(currentPs.rowdblclick){
                $("#scrollTable .tbody tr").dblclick(function(){

                    clearTimeout(TimeFn);

                    var td = $(this).find("td");
                    var rData = new Object();

                    for(var i = 0; i < td.length; i++){
                        var value = $(td[i]).text();
                        var attr = $(td[i]).attr("name");
                        rData[attr] = value;
                    }
                    currentPs.rowdblclick(rData);
                })                        
            }
                    
            if(currentPs.rowmousedown){
                $("#scrollTable .tbody tr").bind("mousedown", function(e){
                    if(e.which === 3){
                        var td = $(this).find("td");
                        var rData = new Object();

                        for(var i = 0; i < td.length; i++){
                            var value = $(td[i]).text();
                            var attr = $(td[i]).attr("name");
                            rData[attr] = value;
                        } 
                        currentPs.rowmousedown(rData);
                    }
                })                          
            } 
            if(currentPs.target.find("#checkAll")){
                currentPs.target.find("#checkAll").click(function(){
                    var checked = $(this).attr("checked");
                    if(checked === 'checked'){
                        $(this).parents("#scrollTable").find(".chexkbox input[type=checkbox]").attr("checked", true);
                        $(this).parents("#scrollTable").find(".chexkbox input[type=checkbox]").parent().parent().addClass("trselect");
                    }else{
                        $(this).parents("#scrollTable").find(".chexkbox input[type=checkbox]").attr("checked", false);
                        $(this).parents("#scrollTable").find(".chexkbox input[type=checkbox]").parent().parent().removeClass("trselect")
                    }
                })
                        
            }
                    
            $("#scrollTable .chexkbox").click(function(e){
                var checked = $(this).find("input[type=checkbox]").attr("checked");
                if(checked === 'checked'){
                    $(this).parent("tr").addClass("trselect");
                }else{
                    $(this).parent("tr").removeClass("trselect");    
                }
                e.stopPropagation();
            })
                    
            //页码点击
            $("#page .pageItem_n").click(function(){
                    
                $("#page .currentPage").removeClass("currentPage").addClass("pageItem_n").click(function(){
                        
                    $("#page .currentPage").removeClass("currentPage").addClass("pageItem_n")
                        
                    $(this).addClass("currentPage");
                });
                    
                $(this).addClass("currentPage");
                
                var pageNo = $(this).text();
                if(!currentPs.url){
                    return;
                }
                if(!currentPs.postData){
                    currentPs.postData = {
                        pageNo: pageNo,
                        pageSize: 20
                    }
                }else{
                    currentPs.postData['pageNo'] =  pageNo;
                    currentPs.postData['pageSize'] =  20;
                }                 
                $.post(currentPs.url, currentPs.postData, function(data, ex){
                    if(ex){
                        g.addData(data, targetPs, targetId);
                    }
                })
                    
            }) 
            
            $("#go_button").unbind('click').click(function(){
                var jumppage = Number($("#jumppage").val());
                if(total < jumppage){
                    jumppage = total;
                }
                if(jumppage < 1){
                    jumppage = 1;
                }
                if(jumppage){
                    if(jumppage !== Number($("#page .currentPage").val())){
                        $("#page .currentPage").removeClass("currentPage").addClass("pageItem_n");
                        var page = $("#page .currentPage").text();
                        if(!currentPs.url){
                            return;
                        }
                        if(!currentPs.postData){
                            currentPs.postData = {
                                pageNo: jumppage,
                                pageSize: 20
                            }
                        }else{
                            currentPs.postData['pageNo'] =  jumppage;
                            currentPs.postData['pageSize'] =  20;
                        }                               
                        $.post(currentPs.url, currentPs.postData, function(data, ex){
                            if(ex){
                                g.addData(data, targetPs, targetId);
                            }
                        })
                    }
                }
            })   
            
        }
        
        $.fn.drawtable = function(t, targetPs , targetId){
            var currentPs = targetPs[targetId];
            if(t){
                currentPs.renderTo = t;
            }else{
                currentPs.renderTo = (typeof currentPs.renderTo == 'string' ? $(currentPs.renderTo) : currentPs.renderTo);
            }

            if(currentPs.colModel){
                var cms = [];
                
                var colNumber = currentPs.colModel.length;

                //计算行宽
                var trLength = currentPs.renderTo.width(); 
                var trLengthTrue;

                //计算列宽
                var num;
                var tdLength;
                var tr = ["<tr>"];    //头行
                if(currentPs.showColNum){
                    trLengthTrue = trLength - 10;
                    tr.push("<th></th>");
                }

                if(currentPs.checkBox){
                    trLengthTrue = trLength - 10;
                    tr.push("<th><input type=checkbox id='checkAll'/></th>");
                }            

                num = trLengthTrue % colNumber; 
                tdLength = (trLengthTrue - num) / colNumber;
                for(var i = 0; i < currentPs.colModel.length; i++){
                    var th;
                    if(currentPs.colModel[i].hidden){
                        th = "<th name=" + currentPs.colModel[i].name + " style='display: none'>" + currentPs.colModel[i].header +"</th>";    
                    }else{
                        if(currentPs.colModel[i].sortable){
                            th = "<th name=" + currentPs.colModel[i].name + " style='cursor:pointer' type='thsort' >" + currentPs.colModel[i].header +"</th>";        
                        }else{
                            th = "<th name=" + currentPs.colModel[i].name + " >" + currentPs.colModel[i].header +"</th>";    
                        }
                        
                    }
                    tr.push(th);
                }
                tr.push("</tr>");

                //构建表格
                var table = [];
                table.push("<div id='scrollTable' style='width:");
                table.push(trLength);
                table.push("px'>");
                table.push("<table class='thead'>");
                if(currentPs.showColNum){
                    table.push("<col width='" + 30 + "px'></col>")
                }
                if(currentPs.checkBox){
                    table.push("<col width='" + 30 + "px'></col>")
                }
                for(var a = 0; a < (currentPs.colModel.length - 1); a++){
                    var col = "<col width='" + tdLength + "px'></col>";
                    table.push(col);
                }
                table.push("<col></col>")
                table.push(tr.join(""));
                table.push("</tbody></table><div id='content' style='width:");
                table.push(trLength);
                table.push("px;' ><table class='tbody'>");

                if(currentPs.showColNum){
                    table.push("<col width='" + 30 + "px'></col>");
                }
                if(currentPs.checkBox){
                    table.push("<col width='" + 30 + "px'></col>");
                }

                for(var b = 0; b < (currentPs.colModel.length - 1); b++){
                    var bodycol = "<col width='" + tdLength + "px'></col>";
                    table.push(bodycol);
                }      
                table.push("<col></col>");
                if(currentPs.showPage){
                    table.push("<tbody></tbody></table></div></div><div id='page'><div style='");
                    table.push("float: right; margin-right: 25px' ><div class='jump'><div class='pageItem_jump'><div style='float:left'>跳转：<input type='text' id='jumppage'/> 页 </div><div id='go_button'>go</div></div></div><div class=page><div class='pagePrv'>上一页</div><div class='pageNext'>下一页</div></div></div></div>")                
                }else{
                    table.push("<tbody></tbody></table></div></div>");
                }

                currentPs.renderTo.append($(table.join("")));
                //修复。showPage为false时。内容区域依旧空了分页栏的BUG
                if(!currentPs.showPage){
                    currentPs.renderTo.find("#content").css({
                        'bottom' : '0px'
                    })                    
                }                
                
                $("#page .pagePrv").click(function(){

                    var currentPage = $(".currentPage").text() - 1;

                    if($("#page .pageItem_n:contains(" + currentPage + ")").length){

                        $("#page .currentPage").removeClass("currentPage").addClass("pageItem_n");

                        $("#page .pageItem_n:contains(" + currentPage + ")").addClass("currentPage");

                        if(!currentPs.url){
                            return;
                        }
                        if(!currentPs.postData){
                            currentPs.postData = {
                                pageNo: currentPage,
                                pageSize: 20
                            }
                        }else{
                            currentPs.postData['pageNo'] =  currentPage;
                            currentPs.postData['pageSize'] =  20;
                        }                           
                        $.post(currentPs.url, currentPs.postData, function(data, ex){
                            if(ex){
                                g.addData(data, targetPs , targetId);
                            }
                        })                    
                    }
                })            

                $("#page .pageNext").click(function(){

                    var currentPage = Number($(".currentPage").text()) + 1;

                    if($("#page .pageItem_n:contains(" + currentPage + ")").length){
                        
                        $("#page .currentPage").removeClass("currentPage").addClass("pageItem_n");

                        $("#page .pageItem_n:contains(" + currentPage + ")").addClass("currentPage");

                        if(!currentPs.url){
                            return;
                        }
                        if(!currentPs.postData){
                            currentPs.postData = {
                                pageNo: currentPage,
                                pageSize: 20
                            }
                        }else{
                            currentPs.postData['pageNo'] =  currentPage;
                            currentPs.postData['pageSize'] =  20;
                        }                        
                        $.post(currentPs.url, currentPs.postData, function(data, ex){
                            if(ex){
                                g.addData(data, targetPs , targetId);
                            }
                        })                      
                    }                                  
                })            
                
                if(currentPs.autoLoad){
                    if(!currentPs.url){
                        return;
                    }
                    if(!currentPs.postData){
                        currentPs.postData = {
                            pageNo: 1,
                            pageSize: 20
                        }
                    }else{
                        currentPs.postData['pageNo'] =  1;
                        currentPs.postData['pageSize'] =  20;
                    }                 
                    if(!currentPs.showPage){
                        currentPs.postData['pageSize'] =  2147483647;
                    }
                    $.post(currentPs.url, currentPs.postData, function(data, ex){
                        if(ex){
                            g.addData(data, targetPs, targetId);
                        }
                    })		                    
                }		
            }
            
        }      

        $.fn.drawtable(t, ps, id);
        
        $.fn.getSelectRow = function(){
            if($(this).length == 1){
                var trs = $(this).find("#content .trselect");
                var rDatas = [];
                for(var i = 0; i < trs.length; i++){

                    var td = $(trs[i]).find("td");
                    var rData = new Object();

                    var o = 0;
                    if(ps.checkBox){
                        o += 1;
                    }
                    if(ps.showColNum){
                        o += 1;
                    }

                    for(; o < td.length; o++){
                        var value = $(td[o]).text();
                        var attr = $(td[o]).attr("name");
                        rData[attr] = value;                                
                    }

                    rDatas.push(rData);
                }
                
                return rDatas;
            }else{
                return [];
            }
        }
        /**
         * 添加静态数据加载。
         */
        $.fn.addSaticData = function(data, colModel){
            if($(this).length == 1){
                var tid = $(this).attr('id');
                var cuttentPs = ps[tid];            
                
                if(cuttentPs.showPage){
                    return;
                }else{
                    //生成数据加入表格
                    var table = cuttentPs.target.find("#scrollTable");
                    var tr = [];
                    var ths = table.find("th");
                    for(var i = 0; i < data.length; i++){
                        if(i%2 == 0){
                            var j = 0;
                            tr.push("<tr class='normalRow'>");

                            if(cuttentPs.showColNum){
                                tr.push("<td class='colNumber' >" + (i + 1) + "</td>");
                                j += 1;
                            }

                            if(cuttentPs.checkBox){
                                tr.push("<td class='chexkbox' >" + "<input type='checkbox'/>" + "</td>");
                                j += 1;                                
                            }

                            for(; j < ths.length; j++){
                                var attr = $(ths[j]).attr("name");
                                var td;
                                var col; 
                                for(var a = 0; a < colModel.length; a++){
                                    if(colModel[a].name === attr){
                                        col = colModel[a];
                                    }
                                }

                                /**
                                * 计算改列的值。支持对象属性。如后台返回列的值为User、页面上可以配置name = User.name 显示用户名
                                * 修改如果属性值为null则页面显示为 ""
                                */
                                var val;
                                if(attr.split(".")[1]){
                                    var objattr = attr.split(".")[1];
                                    var obj = data[i][attr.split(".")[0]];
                                    val = obj[objattr];
                                }else{
                                    val = data[i][attr];
                                } 
                                if(!val){
                                    val = "";
                                }

                                if(col.formatter){
                                    var value = col.formatter(val);
                                    if(col.hidden){
                                        td = "<td name=" + attr + " style='display:none'>" + value + "</td>" ;
                                    }else{
                                        td = "<td name=" + attr + ">" + value + "</td>" ;
                                    }
                                }else{
                                    if(col.hidden){
                                        td = "<td name=" + attr + " style='display:none'>" + val + "</td>" ;
                                    }else{
                                        td = "<td name=" + attr + ">" + val + "</td>" ;
                                    }
                                }
                                tr.push(td);
                            }
                            tr.push("</tr>");

                        }else{
                            var o = 0;
                            tr.push("<tr class='alternateRow'>");

                            if(cuttentPs.showColNum){
                                tr.push("<td>" + (i + 1) + "</td>");
                                o += 1;
                            }
                            if(cuttentPs.checkBox){
                                tr.push("<td class='chexkbox' >" + "<input type='checkbox'/>" + "</td>");
                                o += 1;                                
                            }                            
                            for(; o < ths.length; o++){
                                var attrs = $(ths[o]).attr("name");
                                var tds = "<td name=" + attrs + ">" + data[i][attrs] + "</td>" ;
                                var coleven;
                                var  tdeven;

                                var valeven;
                                if(attrs.split(".")[1]){
                                    var objattreven = attrs.split(".")[1];
                                    var objeven = data[i][attrs.split(".")[0]];
                                    valeven = objeven[objattreven];
                                }else{
                                    valeven = data[i][attrs];
                                }  
                                if(!valeven){
                                    valeven = "";
                                }                            

                                for(var m = 0; m < colModel.length; m++){
                                    if(colModel[m].name === attrs){
                                        coleven = colModel[m];
                                    }
                                }

                                if(coleven.formatter){
                                    if(coleven.hidden){
                                        tdeven = "<td name=" + attrs + " style='display:none'>" + coleven.formatter(valeven) + "</td>" ;    
                                    }else{
                                        tdeven = "<td name=" + attrs + ">" + coleven.formatter(valeven) + "</td>" ;    
                                    }
                                }else{
                                    if(coleven.hidden){  
                                        tdeven = "<td name=" + attrs + " style='display:none'>" + valeven + "</td>" ;    
                                    }else{
                                        tdeven = "<td name=" + attrs + ">" + valeven + "</td>" ;    
                                    }                                
                                }

                                tr.push(tdeven);
                            }
                            tr.push("</tr>")
                        }
                    }
                    $(this).find("#content tbody").empty().append($(tr.join("")));
                    $(this).find("#content").css({
                        "bottom": "0px"
                    })
                }
            }
        }        
        
        var g ={
            addData : function(data, targetPs, targetId){
                var currentPs = targetPs[targetId];
                var table = currentPs.target.find("#scrollTable");
                var colModel = currentPs.colModel;
                var jsonData;
                if(typeof data === 'string'){
                    jsonData = $.parseJSON(data);
                }else{
                    jsonData = data;
                }
                var page = Number(jsonData.pageNo);       //当前页
                var total = Number(jsonData.pageCount);     //总页数
                var pageSize = Number(jsonData.pageSize); //每页的记录条数
                var rowCount = Number(jsonData.totalCount); //总记录数
                var rows = jsonData.result;
                rows = (!rows) ? [] : rows;
                    
                //生成数据加入表格
                var tr = [];
                var ths = table.find("th");
                for(var i = 0; i < rows.length; i++){
                    if(i%2 == 0){
                        var j = 0;
                        tr.push("<tr class='normalRow'>");
                            
                        if(currentPs.showColNum){
                            tr.push("<td class='colNumber' >" + (i + 1) + "</td>");
                            j += 1;
                        }
                            
                        if(currentPs.checkBox){
                            tr.push("<td class='chexkbox' >" + "<input type='checkbox'/>" + "</td>");
                            j += 1;                                
                        }
                            
                        for(; j < ths.length; j++){
                            var attr = $(ths[j]).attr("name");
                            var td;
                            var col; 
                            for(var a = 0; a < colModel.length; a++){
                                if(colModel[a].name === attr){
                                    col = colModel[a];
                                }
                            }
                            
                            /**
                             * 计算改列的值。支持对象属性。如后台返回列的值为User、页面上可以配置name = User.name 显示用户名
                             * 修改如果属性值为null则页面显示为 ""
                             */
                            var val;
                            if(attr.split(".")[1]){
                                var objattr = attr.split(".")[1];
                                var obj = rows[i][attr.split(".")[0]];
                                val = obj[objattr];
                            }else{
                                val = rows[i][attr];
                            } 
                            if(!val&& val != 0){
                                val = "";
                            }
                            if(col.formatter){
                                var value = col.formatter(val);
                                if(col.hidden){
                                    td = "<td name=" + attr + " style='display:none'>" + value + "</td>" ;
                                }else{
                                    td = "<td name=" + attr + ">" + value + "</td>" ;
                                }
                            }else{
                                if(col.hidden){
                                    td = "<td name=" + attr + " style='display:none'>" + val + "</td>" ;
                                }else{
                                    td = "<td name=" + attr + ">" + val + "</td>" ;
                                }
                            }
                            tr.push(td);
                        }
                        tr.push("</tr>");
                            
                    }else{
                        var o = 0;
                        tr.push("<tr class='alternateRow'>");
                            
                        if(currentPs.showColNum){
                            tr.push("<td>" + (i + 1) + "</td>");
                            o += 1;
                        }
                        if(currentPs.checkBox){
                            tr.push("<td class='chexkbox' >" + "<input type='checkbox'/>" + "</td>");
                            o += 1;                                
                        }                            
                        for(; o < ths.length; o++){
                            var attrs = $(ths[o]).attr("name");
                            var tds = "<td name=" + attrs + ">" + rows[i][attrs] + "</td>" ;
                            var coleven;
                            var  tdeven;
                            
                            var valeven;
                            if(attrs.split(".")[1]){
                                var objattreven = attrs.split(".")[1];
                                var objeven = rows[i][attrs.split(".")[0]];
                                valeven = objeven[objattreven];
                            }else{
                                valeven = rows[i][attrs];
                            }  
                            if(!valeven){
                                valeven = "";
                            }                            
                            
                            for(var m = 0; m < colModel.length; m++){
                                if(colModel[m].name === attrs){
                                    coleven = colModel[m];
                                }
                            }
                            
                            if(coleven.formatter){
                                if(coleven.hidden){
                                    tdeven = "<td name=" + attrs + " style='display:none'>" + coleven.formatter(valeven) + "</td>" ;    
                                }else{
                                    tdeven = "<td name=" + attrs + ">" + coleven.formatter(valeven) + "</td>" ;    
                                }
                            }else{
                                if(coleven.hidden){  
                                    tdeven = "<td name=" + attrs + " style='display:none'>" + valeven + "</td>" ;    
                                }else{
                                    tdeven = "<td name=" + attrs + ">" + valeven + "</td>" ;    
                                }                                
                            }
                            
                            tr.push(tdeven);
                        }
                        tr.push("</tr>")
                    }
                }
                currentPs.target.find("#content tbody").empty().append($(tr.join("")));

                //生成分页项
                var page_item_n = "";
                $(".pageItem_n").remove();
                $(".currentPage").remove();
                $(".pageItem_dots").remove();
                    
                var min = 1;
                var max = total;
                    
                if(total <= 10){
                    min = 1;
                    max = total;
                }else{
                    if(page < 5){
                        max = (page + 5) + (5 - page); //显示的最大值
                        min = 1;
                    }else{
                        if((page + 5) >= total){
                            max = total;
                            min = total - 10;
                        }else{
                            min = page - 4;
                            max = page + 5;
                        }
                            
                    }
                }
                
                if(min > 1){
                    page_item_n = "<div class='pageItem_n'>" + 1 + "</div><div class='pageItem_dots'>...</div>"
                }
                
                for(var n = min; n <= max; n++){
                    var b;
                    if(n === page){
                        b = "<div class='currentPage'>" + n + "</div>";    
                    }else{
                        b = "<div class='pageItem_n'>" + n + "</div>";    
                    }
                    page_item_n += b;
                }
                if(total && total != max ){
                    page_item_n += "<div class='pageItem_dots'>...</div><div class='pageItem_n totalRecord'>" + total + "</div>";    
                }
                
                $(page_item_n).insertAfter($(".pagePrv"));                    

                //事件处理
                $.fn.initEvent(total, targetPs, targetId);
            }
        }
    }
        
})(jQuery)