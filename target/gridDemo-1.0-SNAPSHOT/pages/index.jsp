<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
   "http://www.w3.org/TR/html4/loose.dtd">

<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <link href="css/bootstrap/bootstrap.css" type="text/css" rel="stylesheet" />
        <link href="css/mygrid.css" type="text/css" rel="stylesheet" />
        <link href="css/bootstrap/bootstrap-responsive.css" type="text/css" rel="stylesheet" />
        <title>My Grid</title>
	<style>
            body{
                padding-top: 60px;
                padding-bottom: 20px;
            }

            .gridContainer{
                height: 320px;
                border: 1px solid #BDCF95;
                position: relative;
            }

            #info{
                border: 1px solid #BDCF95;
            }
                
            .leftmenu{
                height: 400px;
            }
	</style>        
    </head>    
    <body>
        <!-- 导航条-->
        <div class="navbar navbar-fixed-top">
            <div class="navbar-inner">
                <div class="container">
                    <div class="nav-collapse">
                        <ul class="nav">
                            <li class="active"><a href="#">首页</a></li>				  
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- 内容 -->
        <div class="container">
            <div class="row">
                <!--左栏-->
                <div class="span3">
                    <ul class="unstyled well">
                        <li><a href="json.snippet" id="start">开始使用</a></li>
                        <li><a href="event.snippet" id="event">事件</a></li>
                        <li><a href="column.snippet" id="column">行属性</a></li>
                        <li><a href="rowselect.snippet" id="rowselect">行选中</a></li>
                        <li><a href="search.snippet" id="search">设置外查询</a></li>
                    </ul>			
                </div>
                <!--右栏-->
                <div class="span9">
                    <div class="griddemo">
                    </div>
                </div>
            </div>
        </div>        
    </body>
    <script type="text/javascript" src="js/jquery-1.7.2.min.js"></script>
    <script type="text/javascript" src="js/jquery.hdgrid.js"></script>
    <script type="text/javascript" src="js/demo.js"></script>    
</html>
