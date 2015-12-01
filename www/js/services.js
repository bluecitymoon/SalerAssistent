angular.module('starter.services', [])

    .factory('AuthenticationService', function ($http, ServerRoot, $rootScope) {

        function getToken(user) {


            $http({
                url: ServerRoot + 'jsyanzheng/yz',
                data: user,
                method: 'POST'
            }).success(function (response, status, headers, config) {

                $rootScope.$emit('login-event', {response: response});

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

    .factory('DataService', function ($http, ServerRoot, $rootScope, UtilService) {

        var userData = {username: UtilService.getCurrentLoggedInUser().username, token: UtilService.getCurrentLoggedInUser().token};

        function getTypes() {

            UtilService.showLoadingScreen();
            $http({
                url: ServerRoot + 'danju/getdanju',
                data: userData,
                method: 'POST'
            }).success(function (response, status, headers, config) {


                if (response.code) {
                    UtilService.showAlert(response.message);
                } else {
                    $rootScope.$emit('data-type-load-event', {types: response});
                }

            }).error(function (response, status, headers, config) {
                UtilService.handleCommonServerError(response, status);
            });

        }

        function loadDataSearchConditions(datatypeid) {
            UtilService.showLoadingScreen();
            //var copiedUserData = userData;
            //copiedUserData.bbid = reportid;

            if (mode == 'DEBUG') {

            }


            $http({
                url: ServerRoot + 'danju/getdanjugeshi',
                data: {username: UtilService.getCurrentLoggedInUser().username, token: UtilService.getCurrentLoggedInUser().token, id: datatypeid},
                method: 'POST'
            }).success(function (response, status, headers, config) {

                console.debug(response);

                if (response.code) {

                    UtilService.closeLoadingScreen();

                    UtilService.showAlert(response.message);

                } else {
                    $rootScope.$emit('search-data-conditions-load-event', {conditions: response});

                }

            }).error(function (response, status, headers, config) {
                UtilService.handleCommonServerError(response, status);
            });
        }

        var currentDataType = '';

        function setCurrentDataType(type) {
            currentDataType = type;
        }

        function getCurrentDataType() {
            return currentDataType;
        }

        function loadDataAutocompleteOptions(id) {

            UtilService.showLoadingScreen();
            //var copiedUserData = userData;
            //copiedUserData.cankaodangan = cankaodangan;
            $http({
                url: ServerRoot + 'canzhaoshuju/getzhubiaoshuju',
                data: {username: UtilService.getCurrentLoggedInUser().username, token: UtilService.getCurrentLoggedInUser().token, id: id},
                method: 'POST'
            }).success(function (response, status, headers, config) {

                console.debug(response);

                if (response.code) {

                    UtilService.closeLoadingScreen();

                    UtilService.showAlert(response.message);

                } else {
                    $rootScope.$emit('search-data-options-load-event', {options: response});
                }

            }).error(function (response, status, headers, config) {
                UtilService.handleCommonServerError(response, status);
            });
        }

        function saveData(primaryTableData, secondaryTableData, successCallback) {
            UtilService.showLoadingScreen();

            var primaryParam = [];
            angular.forEach(primaryTableData, function(value, i) {

                if (value.morenzhi) {
                    var o = {id: value.id, morenzhi: value.morenzhi};
                    primaryParam.push(o);
                }

            });

            var secondaryParam = [];
            angular.forEach(secondaryTableData, function(value, i) {

                var singleSecondary = [];
                angular.forEach(value, function(single, j) {

                    if (single.morenzhi) {
                        var o = {id: single.id, morenzhi: single.morenzhi};
                        singleSecondary.push(o);
                    }
                });

                if (singleSecondary.length > 0) {
                    secondaryParam.push(singleSecondary);
                }
            });

            var postData = {username: UtilService.getCurrentLoggedInUser().username, token: UtilService.getCurrentLoggedInUser().token, zhubiao: JSON.stringify(primaryParam), zibiao: JSON.stringify(secondaryParam)};

            $http({
                url: ServerRoot + 'danju/adddanju',
                data: postData,
                method: 'POST'
            }).success(function (response, status, headers, config) {

                console.debug(response);

                if (response.code) {

                    UtilService.closeLoadingScreen();

                    UtilService.showAlert(response.message);

                } else {

                    if(successCallback) {
                        successCallback();
                    }
                }

            }).error(function (response, status, headers, config) {
                UtilService.handleCommonServerError(response, status);
            });
        }

    function loadFinalOptionResultWithCategory(conditionId, optionId, keyword, pageNumber, clientType) {
      UtilService.showLoadingScreen();

      var url = ServerRoot + 'canzhaoshuju/getshujulbfy';
      if (clientType && clientType == 'child') {
        url = ServerRoot + 'canzhaoshuju/getshujulbfy';
      }
      $http({
        url: url,
        data: {username: UtilService.getCurrentLoggedInUser().username, token: UtilService.getCurrentLoggedInUser().token, id: conditionId, leibieid: optionId, guanjianzi: keyword, yeshu: pageNumber},
        method: 'POST'
      }).success(function (response, status, headers, config) {

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
        return {
            getTypes: getTypes,
            loadDataSearchConditions: loadDataSearchConditions,
            setCurrentDataType: setCurrentDataType,
            getCurrentDataType: getCurrentDataType,
            loadDataAutocompleteOptions: loadDataAutocompleteOptions,
          loadFinalOptionResultWithCategory: loadFinalOptionResultWithCategory,
            saveData: saveData
        }
    })

    .factory('ReportService', function ($http, ServerRoot, $rootScope, UtilService) {

        var userData = {username: UtilService.getCurrentLoggedInUser().username, token: UtilService.getCurrentLoggedInUser().token};

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

            $http({
                url: ServerRoot + 'report/getreporttj',
                data: {username: UtilService.getCurrentLoggedInUser().username, token: UtilService.getCurrentLoggedInUser().token, bbid: reportid},
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

        function loadReportAutocompleteOptions(id, type) {
            UtilService.showLoadingScreen();
            //var copiedUserData = userData;
            //copiedUserData.cankaodangan = cankaodangan;
            $http({
                url: ServerRoot + 'canzhaoshuju/getshuju',
                data: {username: UtilService.getCurrentLoggedInUser().username, token: UtilService.getCurrentLoggedInUser().token, id: id, shujuleixing: type},
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

        function loadFinalOptionResultWithCategory(conditionId, optionId, keyword, pageNumber, type) {
            UtilService.showLoadingScreen();

            var queryData = {username: UtilService.getCurrentLoggedInUser().username, token: UtilService.getCurrentLoggedInUser().token, id: conditionId, leibieid: optionId, guanjianzi: keyword, yeshu: pageNumber, shujuleixing: type};
            console.debug(JSON.stringify(queryData));

            //getshujulbfy
            $http({
                url: ServerRoot + 'canzhaoshuju/getleibiecx',
                data: {username: UtilService.getCurrentLoggedInUser().username, token: UtilService.getCurrentLoggedInUser().token, id: conditionId, leibieid: optionId, guanjianzi: keyword, yeshu: pageNumber, shujuleixing: type},
                method: 'POST'
            }).success(function (response, status, headers, config) {

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

        function searchOptionsWithKeyword(keyword, id, page, type) {
            UtilService.showLoadingScreen();

            var pageNumber = 1;
            if (page) {
                pageNumber = page;
            }
            var queryData = {username: UtilService.getCurrentLoggedInUser().username, token: UtilService.getCurrentLoggedInUser().token, id: id, guanjianzi: keyword, yeshu: pageNumber, shujuleixing: type};
            console.debug(JSON.stringify(queryData));

	        var url = 'canzhaoshuju/getmohucx';
	        //if ( type) {
		      //   url = 'canzhaoshuju/getzhubiaoshujulbfy';
	        //}

            $http({
                url: ServerRoot + url,
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

        function queryReport(conditions, pageNumber) {
            UtilService.showLoadingScreen();
            var conditionData = [];

            angular.forEach(conditions, function(value, key) {

                if(value.moren1 || value.moren2) {
                    var singleCondition = {id: value.id, moren1: value.moren1, moren2: value.moren2};
                    conditionData.push(singleCondition);
                }
            });

            var conditionDataJSONstring = JSON.stringify(conditionData).replace(/"/g, '\'');
            var queryData = {username: UtilService.getCurrentLoggedInUser().username, token: UtilService.getCurrentLoggedInUser().token, yeshu: pageNumber, tiaojian: conditionDataJSONstring};

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

        var lastSelectedCondition = {};
        function getCurrentSelectedCondition() {
            return lastSelectedCondition;
        }

        function setCurrentSelectedCondition(condition) {
            lastSelectedCondition = condition;
        }

        return {
            getTypes: getTypes,
            loadReportSearchConditions: loadReportSearchConditions,
            loadReportAutocompleteOptions: loadReportAutocompleteOptions,
            loadFinalOptionResultWithCategory: loadFinalOptionResultWithCategory,
            searchOptionsWithKeyword: searchOptionsWithKeyword,
            queryReport: queryReport,
            setLastSearchCondition: setLastSearchCondition,
            getLastSearchCondition: getLastSearchCondition,
            setCurrentSelectedCondition: setCurrentSelectedCondition,
            getCurrentSelectedCondition: getCurrentSelectedCondition
        }
    })

    .
    factory('UtilService', function ($ionicLoading, $ionicPopup, StorageService) {

        var currentUser = null;
        function getCurrentLoggedInUser() {
            if (currentUser) {
                return currentUser;
            } else {
                return StorageService.getObject("currentuser");
            }
        }

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
                template: '<h5 style="white-space: nowrap; text-align: center"> ' + message + '</h5>',
                okText: '确定',
                okType: 'button button-block button-positive'
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

        var icons = ['ion-ios-list-outline', 'ion-ios-book', 'ion-ios-compose-outline', 'ion-ios-paper-outline', 'ion-ios-calendar-outline', 'ion-ios-albums-outline',
        'ion-ios-briefcase-outline', 'ion-android-calendar', 'ion-android-cloud-outline', 'ion-bag'];
        function getIconByIndex(index) {

            if (index > icons.length) {
                return 'ion-ios-list-outline';
            }
            return icons[index];
        }

        var colors = ['positive', 'balanced', 'assertive', 'royal'];
        function getRandomColorName() {

            var index = Math.floor((Math.random() * 10) / 3) ;

            return colors[index];
        }

        function getRandomAvatar() {
            var index = Math.floor(Math.random() * 8);

            return 'img/' + index + '.jpg';
        }

        return {
            showLoadingScreen: showLoadingScreen,
            closeLoadingScreen: closeLoadingScreen,
            showAlert: showAlert,
            handleCommonServerError : handleCommonServerError,
            getIconByIndex: getIconByIndex,
            getRandomColorName: getRandomColorName,
            getCurrentLoggedInUser: getCurrentLoggedInUser,
            getRandomAvatar: getRandomAvatar
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

    .factory('Chats', function (UtilService, ServerRoot, $rootScope, $http) {

        function loadAllMyChats() {

            UtilService.showLoadingScreen();

            var queryData = {username: UtilService.getCurrentLoggedInUser().username, token: UtilService.getCurrentLoggedInUser().token};
            console.debug(JSON.stringify(queryData));

            $http({
                url: ServerRoot + 'xiaoxi/getxiaoxizhubiao',
                data: {username: UtilService.getCurrentLoggedInUser().username, token: UtilService.getCurrentLoggedInUser().token},
                method: 'POST'
            }).success(function (response, status, headers, config) {

                if (response.code) {

                    UtilService.closeLoadingScreen();

                    UtilService.showAlert(response.message);

                } else {
                    $rootScope.$emit('all-my-chats-load-event', {chats: response});
                    console.debug(response);
                }

            }).error(function (response, status, headers, config) {
                UtilService.handleCommonServerError(response, status);
            });
        }

        function loadMessagesFromChat(chatId) {

            UtilService.showLoadingScreen();

            var queryData = {username: UtilService.getCurrentLoggedInUser().username, token: UtilService.getCurrentLoggedInUser().token, fasongren: chatId, yeshu: 1};
            console.debug(JSON.stringify(queryData));

            $http({
                url: ServerRoot + 'xiaoxi/getxiaoxi',
                data: queryData,
                method: 'POST'
            }).success(function (response, status, headers, config) {

                if (response.code) {

                    UtilService.closeLoadingScreen();

                    UtilService.showAlert(response.message);

                } else {
                    $rootScope.$emit('chat-list-load-event', {messages: response});
                    console.debug(response);
                }

            }).error(function (response, status, headers, config) {
                UtilService.handleCommonServerError(response, status);
            });
        }

        function loadApproveMessageDetails(message) {

            UtilService.showLoadingScreen();

            var queryData = {username: UtilService.getCurrentLoggedInUser().username, token: UtilService.getCurrentLoggedInUser().token, xiaoxiid: message.id};
            console.debug(JSON.stringify(queryData));

            $http({
                url: ServerRoot + 'xiaoxi/shenpixinxi',
                data: queryData,
                method: 'POST'
            }).success(function (response, status, headers, config) {

                if (response.code) {

                    UtilService.closeLoadingScreen();

                    UtilService.showAlert(response.message);

                } else {
                    $rootScope.$emit('single-approve-message-load-event', {messages: response});
                    console.debug(response);
                }

            }).error(function (response, status, headers, config) {
                UtilService.handleCommonServerError(response, status);
            });
        }

        function approve(id, flag, content) {

            UtilService.showLoadingScreen();

            var queryData = {username: UtilService.getCurrentLoggedInUser().username, token: UtilService.getCurrentLoggedInUser().token, xiaoxiid: id, jiegou : flag, fujiaxinxi : content};
            console.debug(JSON.stringify(queryData));

            $http({
                url: ServerRoot + 'xiaoxi/shenpichuli',
                data: queryData,
                method: 'POST'
            }).success(function (response, status, headers, config) {

                if (response.code) {

                    UtilService.closeLoadingScreen();

                    UtilService.showAlert(response.message);

                } else {
                    $rootScope.$emit('approve-message-proccessed-event', {result: response});
                    console.debug(response);
                }

            }).error(function (response, status, headers, config) {
                UtilService.handleCommonServerError(response, status);
            });
        }
        return {

            loadAllMyChats : loadAllMyChats,
            loadMessagesFromChat : loadMessagesFromChat,
            loadApproveMessageDetails : loadApproveMessageDetails,
            approve : approve

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
