package com.pinyougou.shop.controller;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * 商家登录控制器
 *
 * @author liuweijian
 * @version 2019/1/7
 */
@RestController
@RequestMapping("/login")
public class LoginController {
		@RequestMapping("/name")
		public Map name() {
			HashMap<String, String> map = new HashMap<>();
			String name = SecurityContextHolder.getContext().getAuthentication().getName();
			map.put("loginName", name);

			return map;
		}
}
