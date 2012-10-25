package com.yingzi.griddemo.service;

import com.yingzi.griddemo.model.Company;
import com.yingzi.griddemo.model.Page;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Random;

/**
 * 
 * @author yingzi
 */
public class GridService {
   
    /**
     * 查询json数据
     * @param begin  查询记录起始位置
     * @param end    查询记录的结束位置
     * @return page对象
     */
    public Page getJsonData(int begin, int end){
        
        Page page  = new Page();
        List<Company> coms = new ArrayList<Company>();
        Random random = new Random();
        for(int i = begin; i < end; i++){
            Company company = new Company();
            company.setId(i);
            company.setCompany("company" + i);
            company.setChange(random.nextDouble() * 1000);
            company.setLastChange(new Date());
            company.setPctChange(random.nextDouble() * 1000);
            company.setPrice(random.nextDouble() * 1000);
            coms.add(company);
        }
        page.setResult(coms);
        page.setTotalCount(1000);
        page.setPageSize(20);
        return page;
    }
    
}
