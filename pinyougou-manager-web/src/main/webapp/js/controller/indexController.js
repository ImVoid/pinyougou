//首页控制层
app.controller('indexController', function ($scope, loginService) {

    $scope.showLoginName = function () {
        loginService.loginName().success(function (response) {
            $scope.loginName = response.loginName;
        })
    }

})