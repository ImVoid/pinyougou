// 品牌控制层
app.controller('brandController', function ($scope, $http, brandService) {

    //查询品牌列表
    $scope.findAll = function () {
        brandService.findAll().success(function (response) {
            $scope.list = response;
        })
    }

    // 分页控件配置
    $scope.paginationConf = {
        // 当前页
        currentPage: 1,
        // 总记录数
        totalItems: 10,
        // 每页记录数
        itemsPerPage: 10,
        // 分页选项
        perPageOptions: [10, 20, 30, 40, 50],
        // 页码变动时进行的操作
        onChange: function () {
            $scope.reloadList();
        }
    }

    // 重新加载品牌列表
    $scope.reloadList = function() {
        $scope.search($scope.paginationConf.currentPage, $scope.paginationConf.itemsPerPage);
    }

    // 分页查询品牌列表 TODO 作废，使用search替代
    /*$scope.findPage = function (page, size) {
        $http.get('../brand/findPage.do?page=' + page + '&size=' + size).success(
            function (response) {
                // 当前页数据
                $scope.list = response.rows;
                // 总记录数更新
                $scope.paginationConf.totalItems = response.total;
            }
        )
    }*/

    // 分页条件查询品牌列表
    $scope.searchEntity = {}
    $scope.search = function (page, size) {
        brandService.search(page, size, $scope.searchEntity).success(
            function (response) {
                // 当前页数据
                $scope.list = response.rows;
                // 总记录数更新
                $scope.paginationConf.totalItems = response.total;
            }
        )
    }

    // 保存品牌
    $scope.save = function () {
        var object = brandService.add;
        if ($scope.entity.id != null) {
            object = brandService.update;
        }
        object($scope.entity).success(function (response) {
            if (response.success) {
                // 添加成功刷新列表
                $scope.reloadList();
            } else {
                alert("添加失败");
            }
        });
    }

    // 查询品牌信息待修改
    $scope.findOne = function (id) {
        brandService.findOne(id).success(function (response) {
            $scope.entity = response;
        })
    }

    // 保存选中的选项ID
    $scope.selectIds = [];
    // 实时更新选中选项
    $scope.updateSelection = function ($event, id) {
        //如果被选中
        if ($event.target.checked) {
            $scope.selectIds.push(id);
        } else {	//取消选中
            var index = $scope.selectIds.indexOf(id)
            //开始删除位置，删除个数
            $scope.selectIds.splice(index, 1)
        }
    }

    // 删除品牌
    $scope.dele = function () {
        brandService.dele($scope.selectIds).success(function (response) {
            if (response.success) {
                // 删除成功刷新列表
                $scope.reloadList();
            } else {
                alert("删除失败");
            }
        })
    }
})