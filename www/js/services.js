angular.module('starter.services', [])

    .factory('AuthenticationService', function ($http, ServerRoot, $rootScope) {

        function getToken(user) {


            $http({
                url: ServerRoot + 'jsyanzheng/yz',
                data: user,
                method: 'POST'
            }).success(function (response, status, headers, config) {


                $rootScope.$emit('login-event', {response: response});
                console.debug(response);

            }).error(function (response, status, headers, config) {

                response.code = "500";
                if (!response.message) {

                    response.message = "服务器发生了错误。";
                }
                $rootScope.$emit('login-event', {response: response});

            });

        }

        return {
            getToken: getToken
        }
    })

    .factory('ReportService', function ($http, ServerRoot, $rootScope, UtilService) {

        var userData = null;
        if (mode == 'DEBUG') {
            userData = {username: 'admin', token: '0DPiKuNIrrVmD8IUCuw1hQxNqZc='};
        } else {
            userData = {username: loginUser.username, token: loginUser.token};
        }

        function getTypes() {
            UtilService.showLoadingScreen();
            $http({
                url: ServerRoot + 'report/getreport',
                data: userData,
                method: 'POST'
            }).success(function (response, status, headers, config) {


                if (response.code) {
                    UtilService.showAlert(response.message);
                } else {
                    $rootScope.$emit('report-type-load-event', {types: response});
                }

            }).error(function (response, status, headers, config) {
                UtilService.handleCommonServerError(response, status);
            });

        }

        function loadReportSearchConditions(reportid) {
            UtilService.showLoadingScreen();
            //var copiedUserData = userData;
            //copiedUserData.bbid = reportid;

            $http({
                url: ServerRoot + 'report/getreporttj',
                data: {username: loginUser.username, token: loginUser.token, bbid: reportid},
                method: 'POST'
            }).success(function (response, status, headers, config) {

                console.debug(response);

                if (response.code) {

                    UtilService.closeLoadingScreen();

                    UtilService.showAlert(response.message);

                } else {
                    $rootScope.$emit('search-report-conditions-load-event', {conditions: response});

                }

            }).error(function (response, status, headers, config) {
                UtilService.handleCommonServerError(response, status);
            });
        }

        //canzhaoshuju/getshuju

        function loadReportAutocompleteOptions(id) {
            UtilService.showLoadingScreen();
            //var copiedUserData = userData;
            //copiedUserData.cankaodangan = cankaodangan;
            $http({
                url: ServerRoot + 'canzhaoshuju/getshuju',
                data: {username: loginUser.username, token: loginUser.token, id: id},
                method: 'POST'
            }).success(function (response, status, headers, config) {

                console.debug(response);

                if (response.code) {

                    UtilService.closeLoadingScreen();

                    UtilService.showAlert(response.message);

                } else {
                    $rootScope.$emit('search-report-options-load-event', {options: response});
                }

            }).error(function (response, status, headers, config) {
                UtilService.handleCommonServerError(response, status);
            });
        }

        function loadFinalOptionResultWithCategory(conditionId, optionId) {
            UtilService.showLoadingScreen();
            //search-option-detail-load-event
            $http({
                url: ServerRoot + 'canzhaoshuju/getshujulbfy',
                data: {username: loginUser.username, token: loginUser.token, id: conditionId, leibieid: optionId},
                method: 'POST'
            }).success(function (response, status, headers, config) {

                console.debug(response);

                if (response.code) {

                    UtilService.closeLoadingScreen();

                    UtilService.showAlert(response.message);

                } else {
                    $rootScope.$emit('search-option-detail-load-event', {detailOptions: response});
                }

            }).error(function (response, status, headers, config) {
                UtilService.handleCommonServerError(response, status);
            });
        };

        function searchOptionsWithKeyword(keyword, id, page) {
            UtilService.showLoadingScreen();

            var pageNumber = 1;
            if (page) {
                pageNumber = page;
            }
            var queryData = {username: loginUser.username, token: loginUser.token, id: id, guanjianzi: keyword, yeshu: pageNumber};
            console.debug(JSON.stringify(queryData));
            $http({
                url: ServerRoot + 'canzhaoshuju/getshujucxfy',
                data: queryData,
                method: 'POST'
            }).success(function (response, status, headers, config) {

                console.debug(response);

                if (response.code) {

                    UtilService.closeLoadingScreen();

                    UtilService.showAlert(response.message);

                } else {
                    $rootScope.$emit('search-report-options-load-event', {options: response});
                }

            }).error(function (response, status, headers, config) {
                UtilService.handleCommonServerError(response, status);
            });
        };

        function queryReport(conditions) {
            UtilService.showLoadingScreen();
            var conditionData = [];

            angular.forEach(conditions, function(value, key) {

                if(value.moren1 || value.moren2) {
                    var singleCondition = {id: value.id, moren1: value.moren1, moren2: value.moren2};
                    conditionData.push(singleCondition);
                }
            });

            var conditionDataJSONstring = JSON.stringify(conditionData).replace(/"/g, '\'');
            var queryData = {username: loginUser.username, token: loginUser.token, tiaojian: conditionDataJSONstring};

            if (mode == 'DEBUG') {
                queryData = {"username":"admin","token":"0DPiKuNIrrVmD8IUCuw1hQxNqZc=","tiaojian":"[{'id':1196,'moren1':'2013-10-31T16:00:00.000Z','moren2':'2015-11-14T16:00:00.000Z'}]"};
            }
            $http({
                url: ServerRoot + 'report/getreportdata',
                data: queryData,
                method: 'POST'
            }).success(function (response, status, headers, config) {

                console.debug(response);

                if (response.code) {

                    UtilService.closeLoadingScreen();

                    UtilService.showAlert(response.message);

                } else {
                    $rootScope.$emit('search-report-load-event', {reports: response});
                }

            }).error(function (response, status, headers, config) {

                UtilService.handleCommonServerError(response, status);

            });
        };

        var lastSearchCondition = {};
        function setLastSearchCondition(searchCondition) {

            lastSearchCondition = searchCondition;
        }

        function getLastSearchCondition() {

            return lastSearchCondition;
        }

        return {
            getTypes: getTypes,
            loadReportSearchConditions: loadReportSearchConditions,
            loadReportAutocompleteOptions: loadReportAutocompleteOptions,
            loadFinalOptionResultWithCategory: loadFinalOptionResultWithCategory,
            searchOptionsWithKeyword: searchOptionsWithKeyword,
            queryReport: queryReport,
            setLastSearchCondition: setLastSearchCondition,
            getLastSearchCondition: getLastSearchCondition
        }
    })

    .
    factory('UtilService', function ($ionicLoading, $ionicPopup) {

        function showLoadingScreen(message) {

            var msg = '正在载入';
            if (message) {
                msg = message;
            }
            $ionicLoading.show({
                template: '<ion-spinner icon=\"spiral\"></ion-spinner> ' + msg
            });
        }

        function closeLoadingScreen() {
            $ionicLoading.hide();
        }

        function showAlert(message, callback) {

            var alertPopup = $ionicPopup.alert({
                title: '提示信息',
                template: '<h4 style="white-space: nowrap; "> ' + message + '</h4>',
                okText: '确定',
                okType: 'button button-block button-calm'
            });

            if (callback) {
                alertPopup.then(function () {
                    callback();
                });
            }
        }

        function handleCommonServerError(response, statusCode) {

            closeLoadingScreen();

            if (response) {
                showAlert(response);
            } else {
                showAlert("服务器出错。");
            }
        }

        return {
            showLoadingScreen: showLoadingScreen,
            closeLoadingScreen: closeLoadingScreen,
            showAlert: showAlert,
            handleCommonServerError : handleCommonServerError
        }
    })

    .factory('StorageService', function ($window) {

        return {
            get: function (key) {

                var value = '';
                try {
                    value = $window.localStorage[key];
                } catch (e) {
                }

                return value;
            },
            set: function (key, value) {
                $window.localStorage[key] = value;
            },
            setObject: function (key, value) {
                $window.localStorage[key] = JSON.stringify(value);
            },
            getObject: function (key) {
                return JSON.parse($window.localStorage[key] || '{}');
            },
            getArray: function (key) {
                return JSON.parse($window.localStorage[key] || '[]');
            }
        };
    })

    .factory('Chats', function () {
        // Might use a resource here that returns a JSON array

        // Some fake testing data
        var chats = [{
            id: 0,
            name: 'Ben Sparrow',
            lastText: 'You on your way?',
            face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
        }, {
            id: 1,
            name: 'Max Lynx',
            lastText: 'Hey, it\'s me',
            face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
        }, {
            id: 2,
            name: 'Adam Bradleyson',
            lastText: 'I should buy a boat',
            face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
        }, {
            id: 3,
            name: 'Perry Governor',
            lastText: 'Look at my mukluks!',
            face: 'https://pbs.twimg.com/profile_images/598205061232103424/3j5HUXMY.png'
        }, {
            id: 4,
            name: 'Mike Harrington',
            lastText: 'This is wicked good ice cream.',
            face: 'https://pbs.twimg.com/profile_images/578237281384841216/R3ae1n61.png'
        }];

        return {
            all: function () {
                return chats;
            },
            remove: function (chat) {
                chats.splice(chats.indexOf(chat), 1);
            },
            get: function (chatId) {
                for (var i = 0; i < chats.length; i++) {
                    if (chats[i].id === parseInt(chatId)) {
                        return chats[i];
                    }
                }
                return null;
            }
        };
    })

    .factory('CustomerService', function ($http, basicURL) {
        return {
            get: function ($scope, customerId) {
                $http({
                    method: 'GET',
                    url: basicURL + 'customer/' + customerId
                }).success(function (response, status, headers, config) {

                    $scope.customer = response;

                }).error(function (response, status, headers, config) {

                    $scope.customer = null;
                });
            },

            loadAllCustomers: function ($scope) {

                $http({
                    method: 'GET',
                    url: basicURL + 'customer/all'
                }).success(function (response, status, headers, config) {
                    $scope.customers = response;

                }).error(function (response, status, headers, config) {
                    $scope.customers = null;
                });

            },

            refreshCustomerList: function ($scope) {
                this.loadAllCustomers($scope);
                $scope.$broadcast('scroll.refreshComplete');

            },
            searchCustomers: function ($scope, inputValue) {

                var fakecustomers = [{id: 1, name: '江李明', company: '汉询软件', phone: '13761209451'}];
                $http({
                    method: 'GET',
                    url: basicURL + 'customer/search?queryParam=' + inputValue
                }).success(function (response, status, headers, config) {
                    $scope.customers = response;

                }).error(function (response, status, headers, config) {
                    $scope.customers = fakecustomers;
                });

            },
            save: function ($scope, $state, customerId) {
                $http({
                    method: 'POST',
                    url: basicURL + 'customer/save/',
                    data: $scope.customer
                }).success(function (response, status, headers, config) {

                    $scope.customer = response;

                    $scope.$emit('customer_saved_event', {type: customerId, customer: response});

                    $state.go('tab.customer');

                }).error(function (response, status, headers, config) {

                    $scope.customers = null;
                });

            }
        }
    });
