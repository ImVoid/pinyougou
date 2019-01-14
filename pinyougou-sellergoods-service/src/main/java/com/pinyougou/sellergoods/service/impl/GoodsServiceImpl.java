package com.pinyougou.sellergoods.service.impl;

import java.util.Date;
import java.util.List;
import java.util.Map;

import com.alibaba.fastjson.JSON;
import com.pinyougou.mapper.*;
import com.pinyougou.pojo.*;
import com.pinyougou.pojogroup.Goods;
import org.springframework.beans.factory.annotation.Autowired;
import com.alibaba.dubbo.config.annotation.Service;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.pinyougou.pojo.TbGoodsExample.Criteria;
import com.pinyougou.sellergoods.service.GoodsService;

import entity.PageResult;

/**
 * 服务实现层
 *
 * @author Administrator
 */
@Service
public class GoodsServiceImpl implements GoodsService {

	@Autowired
	private TbGoodsMapper goodsMapper;

	@Autowired
	private TbGoodsDescMapper goodsDescMapper;

	@Autowired
	private TbItemMapper itemMapper;

	@Autowired
	private TbSellerMapper sellerMapper;

	@Autowired
	private TbItemCatMapper itemCatMapper;

	/**
	 * 查询全部
	 */
	@Override
	public List<TbGoods> findAll() {
		return goodsMapper.selectByExample(null);
	}

	/**
	 * 按分页查询
	 */
	@Override
	public PageResult findPage(int pageNum, int pageSize) {
		PageHelper.startPage(pageNum, pageSize);
		Page<TbGoods> page = (Page<TbGoods>) goodsMapper.selectByExample(null);
		return new PageResult(page.getTotal(), page.getResult());
	}

	/**
	 * 增加
	 */
	@Override
	public void add(Goods goods) {
		TbGoods gd = goods.getGoods();
		gd.setAuditStatus("0");
		goodsMapper.insert(gd);
		TbGoodsDesc goodsDesc = goods.getGoodsDesc();
		goodsDesc.setGoodsId(gd.getId());
		goodsDescMapper.insert(goodsDesc);
		saveItem(goods);
	}

	/**
	 * 保存SKU
	 * @param goods
	 */
	private void saveItem(Goods goods) {
		//多个SKU
		if ("1".equals(goods.getGoods().getIsEnableSpec())) {
			for (TbItem item : goods.getItemList()) {
				setItemValue(item, goods);
				itemMapper.insert(item);
			}
		} else {
			//单个SKU
			if (goods.getItemList().size() > 0) {
				TbItem item = goods.getItemList().get(0);
				setItemValue(item, goods);
				item.setIsDefault("1");
				itemMapper.insert(item);
			}
		}
	}

	private void setItemValue(TbItem item, Goods goods) {
		//设置标题，商品名 规格值1 规格值2
		String title = goods.getGoods().getGoodsName() + " ";
		Map<String, Object> map = JSON.parseObject(item.getSpec());
		for (String key : map.keySet()) {
			title += map.get(key) + " ";
		}
		item.setTitle(title);

		//设置图片
		List<Map> images = JSON.parseArray(goods.getGoodsDesc().getItemImages(), Map.class);
		if (images.size() > 0) {
			String url = (String) images.get(0).get("url");
			item.setImage(url);
		}

		//设置商品分类
		Long categoryId = goods.getGoods().getCategory3Id();
		item.setCategoryid(categoryId);
		//设置商品分类名
		TbItemCat tbItemCat = itemCatMapper.selectByPrimaryKey(categoryId);
		item.setCategory(tbItemCat.getName());

		//创建时间/更新时间
		item.setCreateTime(new Date());
		item.setUpdateTime(new Date());

		//商品ID
		Long brandId = goods.getGoods().getId();
		item.setGoodsId(brandId);
		//设置商品名
		item.setBrand(goods.getGoods().getGoodsName());

		//销售商ID
		String sellerId = goods.getGoods().getSellerId();
		item.setSellerId(sellerId);
		//商家名
		TbSeller tbSeller = sellerMapper.selectByPrimaryKey(sellerId);
		item.setSeller(tbSeller.getNickName());
	}


	/**
	 * 修改
	 */
	@Override
	public void update(Goods goods) {
		//更新商品基础信息
		goodsMapper.updateByPrimaryKey(goods.getGoods());
		//更新商品扩展信息
		goodsDescMapper.updateByPrimaryKey(goods.getGoodsDesc());
		//删除更新SKU
		for (TbItem item : goods.getItemList()) {
			itemMapper.deleteByPrimaryKey(item.getId());
		}
		saveItem(goods);
	}

	/**
	 * 根据ID获取实体
	 *
	 * @param id
	 * @return
	 */
	@Override
	public Goods findOne(Long id) {
		Goods goods = new Goods();

		//商品基本表
		TbGoods tbGoods = goodsMapper.selectByPrimaryKey(id);
		goods.setGoods(tbGoods);

		//商品扩展表
		TbGoodsDesc tbGoodsDesc = goodsDescMapper.selectByPrimaryKey(id);
		goods.setGoodsDesc(tbGoodsDesc);

		//sku列表
		TbItemExample example = new TbItemExample();
		example.createCriteria().andGoodsIdEqualTo(id);
		List<TbItem> tbItems = itemMapper.selectByExample(example);
		goods.setItemList(tbItems);

		return goods;
	}

	/**
	 * 批量删除
	 */
	@Override
	public void delete(Long[] ids) {
		for (Long id : ids) {
			goodsMapper.deleteByPrimaryKey(id);
		}
	}


	@Override
	public PageResult findPage(TbGoods goods, int pageNum, int pageSize) {
		PageHelper.startPage(pageNum, pageSize);

		TbGoodsExample example = new TbGoodsExample();
		Criteria criteria = example.createCriteria();

		if (goods != null) {
			if (goods.getSellerId() != null && goods.getSellerId().length() > 0) {
				criteria.andSellerIdEqualTo(goods.getSellerId());
			}
			if (goods.getGoodsName() != null && goods.getGoodsName().length() > 0) {
				criteria.andGoodsNameLike("%" + goods.getGoodsName() + "%");
			}
			if (goods.getAuditStatus() != null && goods.getAuditStatus().length() > 0) {
				criteria.andAuditStatusLike("%" + goods.getAuditStatus() + "%");
			}
			if (goods.getIsMarketable() != null && goods.getIsMarketable().length() > 0) {
				criteria.andIsMarketableLike("%" + goods.getIsMarketable() + "%");
			}
			if (goods.getCaption() != null && goods.getCaption().length() > 0) {
				criteria.andCaptionLike("%" + goods.getCaption() + "%");
			}
			if (goods.getSmallPic() != null && goods.getSmallPic().length() > 0) {
				criteria.andSmallPicLike("%" + goods.getSmallPic() + "%");
			}
			if (goods.getIsEnableSpec() != null && goods.getIsEnableSpec().length() > 0) {
				criteria.andIsEnableSpecLike("%" + goods.getIsEnableSpec() + "%");
			}
			if (goods.getIsDelete() != null && goods.getIsDelete().length() > 0) {
				criteria.andIsDeleteLike("%" + goods.getIsDelete() + "%");
			}

		}

		Page<TbGoods> page = (Page<TbGoods>) goodsMapper.selectByExample(example);
		return new PageResult(page.getTotal(), page.getResult());
	}

}
