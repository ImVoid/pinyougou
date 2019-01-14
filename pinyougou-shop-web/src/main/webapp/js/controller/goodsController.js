 //控制层 
app.controller('goodsController' ,function($scope, $controller, $location, goodsService, uploadService, itemCatService, typeTemplateService){
	
	$controller('baseController',{$scope:$scope});//继承
	
    //读取列表数据绑定到表单中  
	$scope.findAll=function(){
		goodsService.findAll().success(
			function(response){
				$scope.list=response;
			}			
		);
	}    
	
	//分页
	$scope.findPage=function(page,rows){			
		goodsService.findPage(page,rows).success(
			function(response){
				$scope.list=response.rows;	
				$scope.paginationConf.totalItems=response.total;//更新总记录数
			}			
		);
	}
	
	//查询实体 
	$scope.findOne=function(){
		var id = $location.search()['id'];
        // alert(id);
		if (id == null) {
			return;
		} else {
            goodsService.findOne(id).success(
                function(response){
                    $scope.entity= response;
                    editor.html($scope.entity.goodsDesc.introduction);
                }
            );
        }
	}
	
	//保存 
	$scope.add=function(){
        $scope.entity.goodsDesc.introduction = editor.html();
        goodsService.add( $scope.entity  ).success(
			function(response){
				if(response.success){
                    alert("新增成功");
                    $scope.entity = {};
                    //清空富文本编辑器
                    editor.html("");
				}else{
					alert(response.message);
				}
			}		
		);				
	}

	//批量删除 
	$scope.dele=function(){			
		//获取选中的复选框			
		goodsService.dele( $scope.selectIds ).success(
			function(response){
				if(response.success){
					$scope.reloadList();//刷新列表
					$scope.selectIds=[];
				}						
			}		
		);				
	}
	
	$scope.searchEntity={};//定义搜索对象 
	
	//搜索
	$scope.search=function(page,rows){			
		goodsService.search(page,rows,$scope.searchEntity).success(
			function(response){
				$scope.list=response.rows;	
				$scope.paginationConf.totalItems=response.total;//更新总记录数
			}			
		);
	}
	
	// 文件上传
    $scope.uploadFile=function () {
		uploadService.upload().success(function (response) {
			if (response.success) {
                $scope.image_entity.url = response.message;
			} else {
                alert(response.message);
			}
        })
    }

    $scope.entity={goods: {}, goodsDesc: {itemImages: [], specificationItems: []}, itemList: []}
    //将当前上传文件添加到图片列表
    $scope.addImageEntity = function () {
        $scope.entity.goodsDesc.itemImages.push($scope.image_entity);
    }

    //在图片列表中删除
    $scope.removeImageEntity = function (index) {
        $scope.entity.goodsDesc.itemImages.splice(index, 1);
    }

    // 展示一级分类列表
    $scope.selectItemCat1List = function () {
		itemCatService.findByParentId(0).success(function (response) {
			$scope.itemCat1List = response;
        })
    }

    // 展示二级分类列表
	$scope.$watch('entity.goods.category1Id', function (newValue, oldValue) {
        itemCatService.findByParentId(newValue).success(function (response) {
            $scope.itemCat2List = response;
        })
    })

    // 展示三级分类列表
	$scope.$watch('entity.goods.category2Id', function (newValue, oldValue) {
        itemCatService.findByParentId(newValue).success(function (response) {
            $scope.itemCat3List = response;
        })
    })

    // 展示三级分类关联的模板ID
    $scope.$watch('entity.goods.category3Id', function (newValue, oldValue) {
        itemCatService.findOne(newValue).success(function (response) {
            $scope.entity.goods.typeTemplateId = response.typeId;
        })
    })

	// 读取模板ID,列出品牌选项、扩展属性、规格列表
	$scope.$watch('entity.goods.typeTemplateId', function (newValue, oldValue) {
		typeTemplateService.findOne(newValue).success(function (response) {
			$scope.typeTemplate = response;
			$scope.typeTemplate.brandIds = JSON.parse($scope.typeTemplate.brandIds);
			$scope.entity.goodsDesc.customAttributeItems = JSON.parse($scope.typeTemplate.customAttributeItems)
        })

		typeTemplateService.findSpecList(newValue).success(function (response) {
			$scope.specList = response;
        })
    })

	$scope.updateSpecAttribute = function ($event, name, value) {
        var object = $scope.searchObjectByKey($scope.entity.goodsDesc.specificationItems, 'attributeName', name);
        //更新
		if (object != null) {
			//追加更新
			if ($event.target.checked) {
                object.attributeValue.push(value);
			} else {
				//删除
                object.attributeValue.splice(object.attributeValue.indexOf(value), 1);
                // 全部清除
				if (object.attributeValue.length == 0) {
                    $scope.entity.goodsDesc.specificationItems.splice($scope.entity.goodsDesc.specificationItems.indexOf(object), 1);
				}
			}
		} else {
			//添加
            $scope.entity.goodsDesc.specificationItems.push({'attributeName': name, 'attributeValue': [value]});
		}
    }

    //创建sku列表
    $scope.createItemList = function () {
		// 定义初始sku列表
		$scope.entity.itemList = [{spec: {}, price: 0, num: 0, status: '0', idDefault: '0'}]
		//获取规格
		var specItems = $scope.entity.goodsDesc.specificationItems;
		// 循环每种规格，添加行列
		for (var i = 0; i < specItems.length; i++) {
            $scope.entity.itemList = addColume($scope.entity.itemList, specItems[i].attributeName, specItems[i].attributeValue);
		}
    }

    addColume = function(itemList, attributeName, attributeValues) {
        var newList = [];
		//循环每一行
		for (var i = 0; i < itemList.length; i++) {
			//记录未修改前的行
            var oldRow = itemList[i];
            // 添加同规格的不同属性值
			for (var j = 0; j < attributeValues.length; j++) {
				// 深拷贝
                var newRow = JSON.parse(JSON.stringify(oldRow));
                newRow.spec[attributeName] = attributeValues[j];
                //新增行
                newList.push(newRow);
			}
		}
		return newList;
	}

	// 状态
	$scope.status = ['未审核', '已审核', '审核未通过', '已关闭']
	// 分类列表
	$scope.itemCatList = []
	$scope.findItemCatList = function () {
		itemCatService.findAll().success(function (response) {
			for (var i = 0; i < response.length; i++) {
                $scope.itemCatList[response[i].id] = response[i].name;
            }
        })
    }
});
