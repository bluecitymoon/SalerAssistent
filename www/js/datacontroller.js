angular.module('starter.datacontrollers', ['ionic-datepicker'])

    .controller('DataCtrl', function ($scope, DataService,ReportService, $rootScope, $stateParams, $ionicHistory, UtilService, $ionicModal, $ionicActionSheet, $state, $ionicScrollDelegate) {

        $scope.title = $stateParams.typename;

        $scope.$on('$ionicView.enter', function (e) {

            var typeId = $stateParams.typeid;

            DataService.loadDataSearchConditions(typeId);

        });

        $scope.tableDeinination = {};
        $scope.childTableData = [];

        $scope.saveData = function() {

            DataService.saveData($scope.tableDeinination.zhubiaogeshi, $scope.childTableData, saveReportSuccess);
        };

        function saveReportSuccess() {
            UtilService.closeLoadingScreen();

            UtilService.showAlert("保存成功！", function() {
                $state.go('tab.data');
            });
        }

        var originalChildTableDefinination = [];

        $scope.toggleDetailCreationPage = function(childDataDefinination) {

            if (childDataDefinination) {
                $scope.tableDeinination.zibiaogeshi = childDataDefinination;
            } else {
                $scope.tableDeinination.zibiaogeshi = angular.copy(originalChildTableDefinination);
            }

            $scope.dataDetailModal.show();

        };

        $scope.closeDetailDialog = function(id) {

            if (id == '1') {
                $scope.dataDetailModal.hide();
            } else {
                $scope.modal.hide();
            }

        };

        $scope.assignSingleDetail = function() {

            $scope.childTableData.push(angular.copy($scope.tableDeinination.zibiaogeshi));

            $scope.dataDetailModal.hide();

            $ionicScrollDelegate.scrollBottom();
        };

        $scope.removeSingleChildData = function(child) {

            var index = $scope.childTableData.indexOf(child);
            $scope.childTableData.splice(index, 1);
        };

        $rootScope.$on('search-data-conditions-load-event', function (event, data) {

            if (data.conditions) {
                $scope.tableDeinination = data.conditions;

                if ($scope.tableDeinination.zibiaogeshi) {
                    originalChildTableDefinination = angular.copy($scope.tableDeinination.zibiaogeshi);
                }
            }
            UtilService.closeLoadingScreen();
        });

        $scope.currentOptionsType = '';
        $scope.currentSelectCondition = {};
        $scope.conditions = [];
        $scope.options = [];
        $scope.allOptions = [];
        //$scope.detailOptions = [];
        $scope.menuOptions = [];

        $scope.optionTreeObject = [];

        $scope.collapse = true;

        $scope.toggleCollapse = function(item){
            $scope.collapse = !$scope.collapse;

            console.debug(item);

            showSecondLevelOptionsAndLoadOptions(item);

        };

        $scope.customTemplate = 'item_default_renderer';

        $scope.toggleTemplate = function() {
            if ($scope.customTemplate == 'ion-item.tmpl.html') {
                $scope.customTemplate = 'item_default_renderer'
            } else {
                $scope.customTemplate = 'ion-item.tmpl.html'
            }
        };

        $rootScope.$on('search-data-options-load-event', function (event, data) {

            if (data.options) {
                angular.forEach(data.options, function(value, key) {

                    if (key == 'leibie') {
                        $scope.allOptions = value;

                        var firstLevelOptions = [];
                        angular.forEach(value, function(o, k) {

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
            } else {
                UtilService.showAlert("无数据");
            }

            UtilService.closeLoadingScreen();
        });

        function buildTreeObjectForMenu(options) {

            angular.forEach(options, function(value, index) {
                console.debug('checking .. ' + JSON.stringify(value));

                var nextLevelOptionArray = findNextLevelOptions(value);

                console.debug('found' + JSON.stringify(nextLevelOptionArray));

                if (nextLevelOptionArray.length > 0 ) {
                    value.tree = nextLevelOptionArray;
                    buildTreeObjectForMenu(nextLevelOptionArray);
                }
            });
        };

        function findNextLevelOptions(inputOption) {

            var secondLevelOptions = [];
            var firstLevelOptionLength = inputOption.bianma.length;
            angular.forEach($scope.allOptions, function(option, i) {

                if (option.bianma) {

                    var secondLevelOptionLength = option.bianma.length;
                    var gap = secondLevelOptionLength - firstLevelOptionLength;

                    if(gap == 2 && option.bianma.indexOf(inputOption.bianma) > -1 ) {

                        option.name = option.mingcheng;
                        option.checked = true;

                        secondLevelOptions.push(option);
                    }
                }
            });

            return secondLevelOptions;
        };

        $scope.showSecondLevelOptionsAndLoadOptions = function(option) {

            var secondLevelOptions = [];

            if (option.bianma) {
                secondLevelOptions = getSecondLevelOptions(option.bianma);
                ReportService.loadFinalOptionResultWithCategory($scope.currentSelectCondition.id, option.id, '', 1 );
            }

            if (secondLevelOptions.length > 0) {

                $scope.menuOptions = secondLevelOptions;
            }
        };

        $scope.keywordCondition = {name : ''};
        $scope.searchFinalOptions = function(option) {

            var keyword = '';
            if (option && option.mingcheng) {
                keyword == option.mingcheng;
            } else {
                keyword = $scope.keywordCondition;
            }

            ReportService.loadFinalOptionResultWithCategory($scope.currentSelectCondition.id, option.id,  keyword);

        };

        $scope.currentPageIndex = 1;
        $scope.searchOptionsWithKeyword = function(wantNextPage) {

            if (wantNextPage) $scope.currentPageIndex ++;

            if ($scope.currentOptionsType == 'leibie') {
                ReportService.loadFinalOptionResultWithCategory($scope.currentSelectCondition.id, $scope.currentSelec.id,  $scope.keywordCondition.name);
            } else {
                //ReportService.loadFinalOptionResultWithCategory($scope.currentSelectCondition.id, option.id,  keyword);

                ReportService.searchOptionsWithKeyword($scope.keywordCondition.name, $scope.currentSelectCondition.id, $scope.currentPageIndex);
            }

        };

        $rootScope.$on('search-option-detail-load-event', function(event, data) {

            var detailOptionsList = data.detailOptions;
            if(detailOptionsList) {

                $scope.options = detailOptionsList;
            }

            UtilService.closeLoadingScreen();

        });

        $scope.showSecondLevelOptionsOrCloseDialog = function(option) {

            $scope.currentSelectCondition.morenzhi = option.mingcheng;
            $scope.modal.hide();

        };

        function getSecondLevelOptions(firstLevelOption) {

            var secondLevelOptions = [];
            var firstLevelOptionLength = firstLevelOption.length;
            angular.forEach($scope.allOptions, function(option, i) {

                if (option.bianma && option.bianma.length > 4) {

                    var secondLevelOptionLength = option.bianma.length;
                    var gap = secondLevelOptionLength - firstLevelOptionLength;

                    if(gap == 2 && option.bianma.indexOf(firstLevelOption) > -1 ) {
                        //{text : option.mingcheng}
                        option.name = option.mingcheng;

                        secondLevelOptions.push(option);
                    }
                }
            });

            return secondLevelOptions;
        };


        $scope.openAutoComplete = function (condition) {

            $scope.currentSelectCondition = condition;
            $scope.options = [];
            $scope.optionTreeObject = {};

            if (condition.id) {

                $scope.keywordCondition.name = '';
                DataService.loadDataAutocompleteOptions(condition.id);

                $scope.modal.show();
            }

        };

        $scope.datepickerObject = {
            titleLabel: '选择日期',  //Optional
            todayLabel: '今天',  //Optional
            closeLabel: '关闭',  //Optional
            setLabel: '设置',  //Optional
            setButtonType : 'button-assertive',  //Optional
            todayButtonType : 'button-calm',  //Optional
            closeButtonType : 'button-calm',  //Optional
            inputDate: new Date(),  //Optional
            mondayFirst: true,  //Optional
            //disabledDates: disabledDates, //Optional
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
            closeOnSelect: false //Optional
        };

        $scope.currentSelectPositionType = 'moren1';
        $scope.openDateDialog = function(condition, type) {

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

                console.log('Selected date is : ', val);
            }
        }

        $ionicModal.fromTemplateUrl('templates/modal/auto-complete-content.html', {
            id: '2',
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
        });

        $scope.submitData = function() {

            console.debug(JSON.stringify($scope.tableDeinination));
        };

        $scope.goback = function () {
            $ionicHistory.goBack();
        };

        $ionicModal.fromTemplateUrl('templates/modal/data-detail-input.html', {
            id: '1', // We need to use and ID to identify the modal that is firing the event!
            scope: $scope,
            backdropClickToClose: false,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.dataDetailModal = modal;
        });


        $scope.closeModal = function(index) {
            if (index == 1) $scope.oModal1.hide();
            else $scope.oModal2.hide();
        };

        /* Listen for broadcasted messages */

        $scope.$on('modal.shown', function(event, modal) {
            console.log('Modal ' + modal.id + ' is shown!');
        });

        $scope.$on('modal.hidden', function(event, modal) {
            console.log('Modal ' + modal.id + ' is hidden!');
        });

        // Cleanup the modals when we're done with them (i.e: state change)
        // Angular will broadcast a $destroy event just before tearing down a scope
        // and removing the scope from its parent.
        $scope.$on('$destroy', function() {
            console.log('Destroying modals...');
            $scope.dataDetailModal.remove();
            $scope.modal.remove();
        });

    });