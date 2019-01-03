// 品牌服务层
app.service("brandService", function ($http) {
    // 查询品牌列表服务
    this.findAll = function () {
        return $http.get('../brand/findAll.do');
    }

    // 分页条件查询品牌列表服务
    this.search = function(page, size, searchEntity) {
        return $http.post('../brand/search.do?page=' + page + '&size=' + size, searchEntity);
    }

    // 品牌添加服务
    this.add = function (entity) {
        return $http.post('../brand/add.do', entity)
    }

    // 品牌更新服务
    this.update = function (entity) {
        return $http.post('../brand/update.do', entity)
    }

    // 品牌查询服务
    this.findOne = function (id) {
        return $http.get("../../brand/findOne.do?id=" + id);
    }

    //品牌删除服务
    this.dele = function (ids) {
        return $http.get("../brand/delete.do?ids=" + ids);
    }

    //查询品牌下拉列表数据
    this.selectOptionList=function () {
        return $http.get('../brand/selectOptionList.do');
    }
})