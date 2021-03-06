 //控制层 
app.controller('itemCatController' ,function($scope,$controller  ,itemCatService, typeTemplateService){
	
	$controller('baseController',{$scope:$scope});//继承
	
    //读取列表数据绑定到表单中  
	$scope.findAll=function(){
		itemCatService.findAll().success(
			function(response){
				$scope.list=response;
			}			
		);
	}    
	
	//分页
	$scope.findPage=function(page,rows){			
		itemCatService.findPage(page,rows).success(
			function(response){
				$scope.list=response.rows;	
				$scope.paginationConf.totalItems=response.total;//更新总记录数
			}			
		);
	}
	
	//查询实体 
	$scope.findOne=function(id){				
		itemCatService.findOne(id).success(
			function(response){
				$scope.entity = response
				typeTemplateService.findAll().success(function (rs) {
                    $scope.options = eval(rs);
                })
                typeTemplateService.findOne($scope.entity['typeId']).success(function (rs) {
                    obj = eval(rs);
                    $scope.selectTypeId = {"id": obj['id'], "text": obj['name']};
                })
			}
		);				
	}
	
	//保存 
	$scope.save=function(){				
		var serviceObject;//服务层对象  				
		if($scope.entity.id!=null){//如果有ID
			serviceObject=itemCatService.update( $scope.entity ); //修改  
		}else{
			$scope.entity.parentId=$scope.parentId;
			serviceObject=itemCatService.add( $scope.entity  );//增加 
		}				
		serviceObject.success(
			function(response){
				if(response.success){
                    $scope.findByParentId($scope.parentId);
				}else{
					alert(response.message);
				}
			}		
		);				
	}
	
	 
	//批量删除 
	$scope.dele=function(){			
		//获取选中的复选框			
		itemCatService.dele( $scope.selectIds ).success(
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
		itemCatService.search(page,rows,$scope.searchEntity).success(
			function(response){
				$scope.list=response.rows;	
				$scope.paginationConf.totalItems=response.total;//更新总记录数
			}			
		);
	}

    //当前分类页面parentId
    $scope.parentId=0;
	$scope.lastEntity={'id': 0}

    // 根据上级ID查询商品分类
    $scope.findByParentId=function(parentId) {
        $scope.parentId=parentId;
		itemCatService.findByParentId(parentId).success(function (response) {
			$scope.list=response;
        })
	}

	//面包屑导航默认等级
	$scope.grade=1

	$scope.setGrade=function (grade) {
		$scope.grade = grade;
    }

    //面包屑导航逻辑
	$scope.selectList=function (p_entity) {
		if ($scope.grade == 1) {
			$scope.entity_1 = null;
			$scope.entity_2 = null;
            $scope.findByParentId(p_entity.id);
		} else if ($scope.grade == 2) {
            $scope.entity_1 = p_entity;
            $scope.entity_2 = null;
            $scope.findByParentId(p_entity.id);
		} else if ($scope.grade == 3) {
            $scope.entity_2 = p_entity;
            $scope.findByParentId(p_entity.id);
		}
        $scope.lastEntity = p_entity;
    }

    //类型模板select2选项列表
    $scope.options = {'data':[]};
    $scope.selectOptionList=function () {
    	typeTemplateService.selectOptionList().success(function (response) {
            $scope.options={'data': response};
        })
    }

});	
