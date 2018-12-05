// 品牌控制层
app.controller('brandController', function ($scope, $http, $controller, brandService) {

    //集成baseController
    $controller('baseController', {$scope:$scope});

    //查询品牌列表
    $scope.findAll = function () {
        brandService.findAll().success(function (response) {
            $scope.list = response;
        })
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