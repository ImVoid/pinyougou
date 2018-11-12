package com.pinyougou.sellergoods.service;

import com.pinyougou.pojo.TbBrand;
import entity.PageResult;

import java.util.List;

/**
 * 品牌接口
 *
 * @author liuweijian
 * @version 2018/11/8.
 */
public interface BrandService {

	List<TbBrand> findAll();

	/**
	 * 品牌分页
	 * @param pageNum 当前页码
	 * @param pageSize 页记录数
	 * @return
	 */
	PageResult findPage(int pageNum, int pageSize);

	/**
	 * 品牌添加
	 * @param brand
	 */
	void add(TbBrand brand);

	/**
	 * 根据ID查找品牌信息
	 * @param id
	 * @return
	 */
	TbBrand findOne(Long id);

	/**
	 * 更新品牌信息
	 * @param brand
	 */
	void update(TbBrand brand);

	/**
	 * 删除品牌
	 * @param ids
	 */
	void delete(Long[] ids);
}
