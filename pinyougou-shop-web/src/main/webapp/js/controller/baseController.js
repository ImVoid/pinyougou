app.controller('baseController', function ($scope) {
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

    // 重新加载列表
    $scope.reloadList = function() {
        $scope.search($scope.paginationConf.currentPage, $scope.paginationConf.itemsPerPage);
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

    //json提取
    $scope.jsonToString = function (jsonString, key) {
        var json = JSON.parse(jsonString);
        var value = "";
        for (i = 0; i < json.length; i++) {
            if (i > 0) {
                value += ",";
            }
            value += json[i][key];
        }

        return value;
    }

    // 遍历list发现符合条件的值返回
    $scope.searchObjectByKey = function (list, key, keyValue) {
        for (i = 0; i < list.length; i++) {
            if (list[i][key] == keyValue) {
                return list[i];
            }
        }
        return null;
    }
})