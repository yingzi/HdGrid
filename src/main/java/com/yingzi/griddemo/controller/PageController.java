package com.yingzi.griddemo.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 *
 * 负责页面请求的相应
 * @author yingzi
 */
@Controller
public class PageController {
    
    @RequestMapping("index.html")
    public String index(HttpServletRequest request, HttpServletResponse rssp){
        return "index";
    }
    
}
