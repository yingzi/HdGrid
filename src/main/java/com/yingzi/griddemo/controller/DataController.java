package com.yingzi.griddemo.controller;

import com.yingzi.griddemo.model.Page;
import com.yingzi.griddemo.service.GridService;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 *
 * 负责构造演示数据
 * @author yingzi
 */
@Controller
public class DataController {
    
    private GridService gridService;

    public GridService getGridService() {
        return gridService;
    }

    public void setGridService(GridService gridService) {
        this.gridService = gridService;
    }
    
    @RequestMapping("jsonData.html")
    @ResponseBody
    public Page getJsonData(HttpServletRequest request, HttpServletResponse response) {
        Page page = null;
        //获取页数
        Integer pageNo = Integer.parseInt(request.getParameter("pageNo"));
        //获取每页显示的记录数
        Integer pageSize = Integer.parseInt(request.getParameter("pageSize"));
        //获取起始记录数
        Integer begin = (pageNo - 1) * pageSize;
        //获取分页对象
        page = gridService.getJsonData(begin, pageSize + begin);
        page.setPageNo(pageNo);
        page.setPageSize(pageSize);       
        
        return page;
    }
    
}
