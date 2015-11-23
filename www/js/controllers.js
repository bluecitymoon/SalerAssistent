angular.module('starter.controllers', ['ionic-datepicker'])

    .controller('LoginCtrl', function ($scope, AuthenticationService, $state, $rootScope, $ionicPopup, UtilService, StorageService) {

        $scope.user = {username: '', password: null};

        $scope.signIn = function (user) {

            UtilService.showLoadingScreen('正在登录');

            if (user && user.username && user.password) {

                loginUser.username = user.username;

                AuthenticationService.getToken(user);

            } else {

                UtilService.closeLoadingScreen();

                UtilService.showAlert('请输入用户和密码！');

            }

            $rootScope.$on('login-event', function (event, data) {

                var response = data.response;

                if (response && response.code) {

                    switch (response.code) {

                        case "6":
                            $state.go('tab.chats');

                            loginUser.token = response.token;

                            var currentuser = {username: $scope.user.username, password: $scope.user.password, token: response.token};
                            StorageService.setObject('currentuser', currentuser);

                            user = response;
                            break;
                        default:

                            UtilService.showAlert(response.message);
                            break;
                    }
                }

                UtilService.closeLoadingScreen();
            });

        };
    })

    .controller('DataTypesCtrl', function ($scope, DataService, $rootScope, UtilService, $window) {
        $scope.$on('$ionicView.enter', function (e) {
            DataService.getTypes();
        });

        $scope.types = [];

        $rootScope.$on('data-type-load-event', function (event, data) {

            if (data.types) {
                $scope.types = data.types;

                angular.forEach($scope.types, function(value, index) {

                    value.icon = UtilService.getIconByIndex(index + 4);
                    value.customColor = UtilService.getRandomColorName();
                });
            }
            UtilService.closeLoadingScreen();
        });

        $scope.itemHeight = $window.innerWidth / 3;
    })

    .controller('ReportTypesCtrl', function ($scope, ReportService, $rootScope, UtilService, $window) {

        $scope.$on('$ionicView.enter', function (e) {
            ReportService.getTypes();
        });

        $scope.types = [];

        $rootScope.$on('report-type-load-event', function (event, data) {

            if (data.types) {
                $scope.types = data.types;

                angular.forEach($scope.types, function(value, index) {

                    value.icon = UtilService.getIconByIndex(index);
                    value.customColor = UtilService.getRandomColorName();
                });

            }
            UtilService.closeLoadingScreen();
        });

        $scope.itemHeight = $window.innerWidth / 3;
    })

    .controller('ReportResultCtrl', function ($rootScope, $scope, $state, UtilService, ReportService, $ionicModal) {

        $scope.currentPageNumber = 1;
        $scope.message = {pullingText: '下拉加载下一页'};
        $scope.$on('$ionicView.enter', function (e) {

            ReportService.queryReport(ReportService.getLastSearchCondition(), $scope.currentPageNumber);

        });

        $scope.selectedReport = {};
        $scope.showReportDetail = function (report) {
            $scope.selectedReport = report;

            $scope.modal.show();
        };

        $scope.reports = [];
        $scope.top3Attributes = [];

        var top3AttributesFound = false;
        $rootScope.$on('search-report-load-event', function (event, data) {

            if (data.reports && data.reports.length > 0) {

                angular.forEach(data.reports, function (value, index) {
                    $scope.reports.push(value);
                });

                if (!top3AttributesFound) {
                    var singleReportKeys = Object.keys(data.reports[0]);
                    top3AttributesFound = true;

                    $scope.top3Attributes.push(singleReportKeys[0]);
                    $scope.top3Attributes.push(singleReportKeys[1]);
                    $scope.top3Attributes.push(singleReportKeys[2]);

                }

            } else {
                $scope.message.pullingText = '已没有更多数据';
            }

            UtilService.closeLoadingScreen();
        });

        $ionicModal.fromTemplateUrl('templates/modal/single-report-detail.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
        });

        $scope.closeAutoCompleteDialog = function () {
            $scope.modal.hide();

        };

        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function () {
            $scope.modal.remove();
        });

        // Execute action on hide modal
        $scope.$on('modal.hidden', function () {

        });

        // Execute action on remove modal
        $scope.$on('modal.removed', function () {
            // Execute action
        });
    })

    .controller('ReportSearchCtrl', function ($scope, ReportService, $rootScope, $stateParams, $ionicHistory, UtilService, $ionicModal, $ionicActionSheet, $state) {

        $scope.$on('$ionicView.enter', function (e) {

            var typeId = $stateParams.typeid;

            ReportService.loadReportSearchConditions(typeId);
        });

        $scope.conditions = [];
        $scope.options = [];
        $scope.allOptions = [];
        //$scope.detailOptions = [];
        $scope.menuOptions = [];

        $scope.optionTreeObject = [];

        $scope.collapse = true;

        $scope.toggleCollapse = function (item) {
            $scope.collapse = !$scope.collapse;

            showSecondLevelOptionsAndLoadOptions(item);

        };

        $scope.customTemplate = 'item_default_renderer';

        $scope.toggleTemplate = function () {
            if ($scope.customTemplate == 'ion-item.tmpl.html') {
                $scope.customTemplate = 'item_default_renderer'
            } else {
                $scope.customTemplate = 'ion-item.tmpl.html'
            }
        };

        //showSecondLevelOptionsAndLoadOptions TODO
        $rootScope.$on('search-report-conditions-load-event', function (event, data) {

            if (data.conditions) {
                $scope.conditions = data.conditions;
            }
            UtilService.closeLoadingScreen();
        });

        $scope.currentOptionsType = '';
        $scope.currentSelectCondition = {};

        $rootScope.$on('search-report-options-load-event', function (event, data) {

            if (data.options) {
                angular.forEach(data.options, function (value, key) {

                    if (key == 'leibie') {
                        $scope.allOptions = value;


                        var firstLevelOptions = [];
                        angular.forEach(value, function (o, k) {

                            if (o.bianma && o.bianma.length == 4) {

                                o.name = o.mingcheng;
                                o.checked = true;
                                firstLevelOptions.push(o);
                            }
                        });

                        buildTreeObjectForMenu(firstLevelOptions);

                        $scope.optionTreeObject = firstLevelOptions;

                        $scope.menuOptions = firstLevelOptions;


                    } else {
                        $scope.options = value;
                    }

                    $scope.currentOptionsType = key;

                    $scope.$broadcast('scroll.refreshComplete');

                });
            }

            UtilService.closeLoadingScreen();
        });

        function buildTreeObjectForMenu(options) {

            angular.forEach(options, function (value, index) {

                var nextLevelOptionArray = findNextLevelOptions(value);

                if (nextLevelOptionArray.length > 0) {
                    value.tree = nextLevelOptionArray;
                    buildTreeObjectForMenu(nextLevelOptionArray);
                }

            });

        };

        function findNextLevelOptions(inputOption) {

            var secondLevelOptions = [];
            var firstLevelOptionLength = inputOption.bianma.length;
            angular.forEach($scope.allOptions, function (option, i) {

                if (option.bianma) {

                    var secondLevelOptionLength = option.bianma.length;
                    var gap = secondLevelOptionLength - firstLevelOptionLength;

                    if (gap == 2 && option.bianma.indexOf(inputOption.bianma) > -1) {

                        option.name = option.mingcheng;
                        option.checked = true;

                        secondLevelOptions.push(option);
                    }
                }
            });

            return secondLevelOptions;
        };

        $scope.closeDetailDialog = function () {
            $scope.modal.hide();

        };
        $scope.showSecondLevelOptionsAndLoadOptions = function ($event) {

            var optionId = $event.target.id;
            if (optionId) {
                ReportService.loadFinalOptionResultWithCategory($scope.currentSelectCondition.id, optionId, '', 1);
            }
        };

        $scope.keywordCondition = {name: ''};
        $scope.searchFinalOptions = function (option) {

            var keyword = '';
            if (option && option.mingcheng) {
                keyword == option.mingcheng;
            } else {
                keyword = $scope.keywordCondition;
            }

            ReportService.loadFinalOptionResultWithCategory($scope.currentSelectCondition.id, option.id, keyword);

        };

        $scope.currentPageIndex = 1;
        $scope.searchOptionsWithKeyword = function (wantNextPage) {

            if (wantNextPage) $scope.currentPageIndex++;

            ReportService.searchOptionsWithKeyword($scope.keywordCondition.name, $scope.currentSelectCondition.id, $scope.currentPageIndex);

        };

        $rootScope.$on('search-option-detail-load-event', function (event, data) {

            var detailOptionsList = data.detailOptions;
            if (detailOptionsList) {

                $scope.options = detailOptionsList;
            }

            UtilService.closeLoadingScreen();

        });

        $scope.showSecondLevelOptionsOrCloseDialog = function (option) {

            $scope.currentSelectCondition.moren1 = option.mingcheng;
            $scope.modal.hide();

        };

        $scope.queryReport = function () {

            ReportService.setLastSearchCondition($scope.conditions);
            $state.go('report-search-result');
        };

        $scope.openAutoComplete = function (condition) {
            $scope.currentSelectCondition = condition;
            if (condition.id) {

                $scope.openModal(condition);
            }

        };

        $scope.goback = function () {
            $ionicHistory.goBack();
        };

        $scope.datepickerObject = {
            titleLabel: '选择日期',  //Optional
            todayLabel: '今天',  //Optional
            closeLabel: '关闭',  //Optional
            setLabel: '设置',  //Optional
            setButtonType: 'button-assertive',  //Optional
            todayButtonType: 'button-calm',  //Optional
            closeButtonType: 'button-calm',  //Optional
            inputDate: new Date(),  //Optional
            mondayFirst: true,  //Optional
            weekDaysList: weekDaysList, //Optional
            monthList: monthList, //Optional
            templateType: 'modal', //Optional
            showTodayButton: 'true', //Optional
            modalHeaderColor: 'bar-positive', //Optional
            modalFooterColor: 'bar-positive', //Optional
            from: new Date(2000, 8, 2), //Optional
            to: new Date(2020, 8, 25),  //Optional
            callback: function (val) {  //Mandatory
                datePickerCallback(val);
            },
            dateFormat: 'yyyy/MM/dd', //Optional
            closeOnSelect: true //Optional
        };

        $scope.currentSelectPositionType = 'moren1';
        $scope.openDateDialog = function (condition, type) {

            $scope.currentSelectCondition = condition;
            $scope.currentSelectPositionType = type;
        };

        function datePickerCallback(val) {

            if (typeof(val) === 'undefined') {
                console.log('Date not selected');
            } else {

                if ($scope.currentSelectPositionType === 'moren2') {
                    $scope.currentSelectCondition.moren2 = val;
                } else {
                    $scope.currentSelectCondition.moren1 = val;
                }
            }
        }

        $ionicModal.fromTemplateUrl('templates/modal/auto-complete-content.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
        });


        $scope.openModal = function (condition) {

            $scope.keywordCondition.name = '';
            ReportService.loadReportAutocompleteOptions(condition.id);

            $scope.modal.show();
        };

        $scope.closeAutoCompleteDialog = function () {
            $scope.modal.hide();

            $scope.currentPageIndex = 1;
            $scope.options = [];
        };

        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function () {
            $scope.modal.remove();
        });

        // Execute action on hide modal
        $scope.$on('modal.hidden', function () {
            $scope.currentPageIndex = 1;
            $scope.options = [];
        });

        // Execute action on remove modal
        $scope.$on('modal.removed', function () {
            // Execute action
        });


    })

    .controller('ChatsCtrl', function ($scope, Chats) {

        //$scope.$on('$ionicView.enter', function(e) {
        //});

        $scope.chats = Chats.all();
        $scope.remove = function (chat) {
            Chats.remove(chat);
        };
    })

    .controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
        $scope.chat = Chats.get($stateParams.chatId);
    })

    .controller('CustomerCtrl', function ($scope, $state, CustomerService, StorageService) {
        $scope.customers = [];

        $scope.dateCustomer = function (customer) {
            //open date picker

        };

        $scope.callHim = function (customer) {
            window.open('tel:' + customer.phone);
        };

        $scope.inputValue = null;
        $scope.searchCustomers = function (inputValue) {
            CustomerService.searchCustomers($scope, inputValue);
        };

        $scope.logoffUser = function() {


            StorageService.setObject('currentuser', {});
            $state.go('sign-in');
        };
    })

    .controller('CustomerDetailController', function ($scope, CustomerService, $stateParams, $ionicHistory) {

        $scope.customer = null;

        var customerId = $stateParams.customerId;

        $scope.goBack = function () {
            $ionicHistory.goBack();
        };

        var AMapArea = document.getElementById('mapContainer');

        AMapArea.parentNode.style.height = "90%";

        $scope.AMapId = 'mapContainer';

        $scope.geolocation;
        //加载地图，调用浏览器定位服务
        $scope.map = new AMap.Map('mapContainer', {
            resizeEnable: true
        });
        $scope.map.plugin('AMap.Geolocation', function () {
            $scope.geolocation = new AMap.Geolocation({
                enableHighAccuracy: true,//是否使用高精度定位，默认:true
                timeout: 10000,          //超过10秒后停止定位，默认：无穷大
                maximumAge: 0,           //定位结果缓存0毫秒，默认：0
                convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
                showButton: true,        //显示定位按钮，默认：true
                buttonPosition: 'LB',    //定位按钮停靠位置，默认：'LB'，左下角
                buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                showMarker: true,        //定位成功后在定位到的位置显示点标记，默认：true
                showCircle: true,        //定位成功后用圆圈表示定位精度范围，默认：true
                panToLocation: true,     //定位成功后将定位到的位置作为地图中心点，默认：true
                zoomToAccuracy: true      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
            });
            $scope.map.addControl($scope.geolocation);
            AMap.event.addListener($scope.geolocation, 'complete', onComplete);//返回定位信息
            AMap.event.addListener($scope.geolocation, 'error', onError);      //返回定位出错信息
        });
        //获取当前位置信息
        $scope.getCurrentPosition = function () {
            $scope.geolocation.getCurrentPosition();
        }
        ;
        //监控当前位置并获取当前位置信息
        $scope.watchPosition = function () {
            $scope.geolocation.watchPosition();
        };

        //解析定位结果
        function onComplete(data) {
            var str = '<div>定位成功</div>';
            str += '<div>经度：' + data.position.getLng() + '</div>';
            str += '<div>纬度：' + data.position.getLat() + '</div>';
            str += '<div>精度：' + data.accuracy + ' 米</div>';
            str += '<div>是否经过偏移：' + (data.isConverted ? '是' : '否') + '</div>';
            result.innerHTML = str;

            $scope.$emit('map_created');
        };

        $scope.$on('map_created', function () {
            $scope.geolocation.getCurrentPosition();
        });

        //解析定位错误信息
        function onError(data) {
            var str = '<p>定位失败</p>';
            str += '<p>错误信息：'
            switch (data.info) {
                case 'PERMISSION_DENIED':
                    str += '浏览器阻止了定位操作';
                    break;
                case 'POSITION_UNAVAILBLE':
                    str += '无法获得当前位置';
                    break;
                case 'TIMEOUT':
                    str += '定位超时';
                    break;
                default:
                    str += '未知错误';
                    break;
            }
            str += '</p>';
            result.innerHTML = str;
        }
    });
