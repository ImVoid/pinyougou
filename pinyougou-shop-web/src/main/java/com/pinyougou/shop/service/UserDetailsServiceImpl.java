package com.pinyougou.shop.service;

import com.pinyougou.pojo.TbSeller;
import com.pinyougou.sellergoods.service.SellerService;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

/**
 * 认证类
 *
 * @author liuweijian
 * @version 2019/1/4
 */
public class UserDetailsServiceImpl implements UserDetailsService {

	private SellerService sellerService;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		System.out.println("经过了UserDetailsServiceImpl");

		List<GrantedAuthority> grantAuths = new ArrayList<>();
		grantAuths.add(new SimpleGrantedAuthority("ROLE_SELLER"));

		TbSeller seller = sellerService.findOne(username);
		if (seller != null && seller.getStatus().equals("1")) {
			return new User(username, seller.getPassword(), grantAuths);
		} else {
			return null;
		}
	}

	public void setSellerService(SellerService sellerService) {
		this.sellerService = sellerService;
	}
}
