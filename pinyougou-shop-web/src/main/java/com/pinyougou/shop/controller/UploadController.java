package com.pinyougou.shop.controller;

import entity.Result;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import util.FastDFSClient;

/**
 * 文件上传控制层
 *
 * @author liuweijian
 * @version 2019/1/11
 */
@RestController
public class UploadController {

	@Value("${FILE_SERVER_URL}")
	private String fileServerUrl;

	@RequestMapping("/upload")
	public Result upload(MultipartFile file) {
		String originalFilename = file.getOriginalFilename();
		String extName = originalFilename.substring(originalFilename.lastIndexOf(".") + 1);

		try {
			FastDFSClient client = new FastDFSClient("classpath:config/fdfs_client.conf");
			String fileId = client.uploadFile(file.getBytes(), extName);
			String url = fileServerUrl + fileId;
			return new Result(true, url);
		} catch (Exception e) {
			e.printStackTrace();
			return new Result(false, "上传失败");
		}
	}
}