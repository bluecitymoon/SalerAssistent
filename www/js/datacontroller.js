angular.module('starter.datacontrollers', ['ionic-datepicker'])

	.controller('DataCtrl', function ($scope, DataService, ReportService, $rootScope, $stateParams, $ionicHistory, UtilService, $ionicModal, $ionicActionSheet, $state, $ionicScrollDelegate) {


		$scope.menuShown = true;
		$scope.toggleMenu = function () {
			$scope.menuShown = !$scope.menuShown;
		};
		$scope.title = $stateParams.typename;

		$scope.$on('$ionicView.enter', function (e) {

			var typeId = $stateParams.typeid;

			DataService.loadDataSearchConditions(typeId);

		});

		$scope.tableDeinination = {};
		$scope.childTableData = [];

		$scope.saveData = function () {

			DataService.saveData($scope.tableDeinination.zhubiaogeshi, $scope.childTableData, saveReportSuccess);
		};

		function saveReportSuccess() {
			UtilService.closeLoadingScreen();

			UtilService.showAlert("保存成功！", function () {
				$state.go('tab.data');
			});
		}

		var originalChildTableDefinination = [];

		$scope.toggleDetailCreationPage = function (childDataDefinination) {

			if (childDataDefinination) {
				$scope.tableDeinination.zibiaogeshi = childDataDefinination;
			} else {
				$scope.tableDeinination.zibiaogeshi = angular.copy(originalChildTableDefinination);
			}

			$scope.dataDetailModal.show();
			$scope.userOnDetailPage = true;

		};


		//open detail modal after the auto-complete modal is open when user is on the detail page.
		$scope.userOnDetailPage = false;
		$scope.closeDetailDialog = function (id) {

			if (id == '1') {
				$scope.dataDetailModal.hide();

				$scope.userOnDetailPage = false;
			} else {
				$scope.modal.hide();

				if ($scope.userOnDetailPage) {
					$scope.dataDetailModal.show();
				}
			}


		};

		$scope.assignSingleDetail = function () {

			$scope.childTableData.push(angular.copy($scope.tableDeinination.zibiaogeshi));

			$scope.dataDetailModal.hide();
			$scope.userOnDetailPage = false;

			$ionicScrollDelegate.scrollBottom();
		};

		$scope.removeSingleChildData = function (child) {

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

						if (value && value.length == 0) {

							$scope.thereisNoMorePages = true;
							UtilService.showAlert('没有发现数据');

						} else {
							angular.forEach(value, function (o, k) {

								$scope.options.unshift(o);
							});
						}
					}

					$scope.currentOptionsType = key;

					$scope.$broadcast('scroll.refreshComplete');

				});
			} else {
				UtilService.showAlert('没有发现数据');
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

		$scope.showSecondLevelOptionsAndLoadOptions = function ($event) {

			var optionId = $event.target.id;

			//THERE is a <SPAN> under <ion-item>. when user clicks on the span, what we want is actually the ion-item. so we ask for its parent element.
			if (!optionId) {
				optionId = $event.target.parentElement.id;
			}

			var type = $scope.userOnDetailPage? 'biaojiegou' : 'mobandangan';
			if (optionId) {
				ReportService.loadFinalOptionResultWithCategory($scope.currentSelectCondition.id, optionId, '', 1, type);
			}
		};

		$scope.keywordCondition = {name: ''};

		$scope.currentPageIndex = 1;
		$scope.thereisNoMorePages = false;
		$scope.searchOptionsWithKeyword = function (wantNextPage) {

			if ($scope.thereisNoMorePages) {

				UtilService.showAlert('没有更多的数据了');
				$scope.$broadcast('scroll.refreshComplete');

				return;
			}

			if (wantNextPage) {
				$scope.currentPageIndex++;
			} else {

				//without wantNextPage parameter means 'clicking search' button.
				clearUpLastQueryData();
			}

			var type = $scope.userOnDetailPage? 'biaojiegou' : 'mobandangan';
			ReportService.searchOptionsWithKeyword($scope.keywordCondition.name, $scope.currentSelectCondition.id, $scope.currentPageIndex, type);

		};

		function clearUpLastQueryData() {

			$scope.options = [];
		}

		$scope.sourceTypeForLikeQuery = 'mobandangan';

		$rootScope.$on('search-option-detail-load-event', function (event, data) {

			var detailOptionsList = data.detailOptions;
			if (detailOptionsList) {

				$scope.options = detailOptionsList;
			}

			UtilService.closeLoadingScreen();

		});

		$scope.showSecondLevelOptionsOrCloseDialog = function (option) {

			$scope.currentSelectCondition.morenzhi = option.mingcheng;
			$scope.modal.hide();

			if ($scope.userOnDetailPage) {
				$scope.dataDetailModal.show();
			}

		};

		$scope.openAutoComplete = function (condition, sourceTypeForLikeQuery) {

			$scope.sourceTypeForLikeQuery = sourceTypeForLikeQuery;

			$scope.currentSelectCondition = condition;
			$scope.options = [];
			$scope.optionTreeObject = {};

			if (condition.id) {

				$scope.keywordCondition.name = '';
				ReportService.loadReportAutocompleteOptions(condition.id, 'mobandangan');

				$scope.modal.show();
			}

		};

		$scope.openAutoCompleteForDetail = function (condition, sourceTypeForLikeQuery) {

			$scope.sourceTypeForLikeQuery = sourceTypeForLikeQuery;

			$scope.currentSelectCondition = condition;
			$scope.options = [];
			$scope.optionTreeObject = {};

			if (condition.id) {

				$scope.keywordCondition.name = '';
				ReportService.loadReportAutocompleteOptions(condition.id, 'biaojiegou');

				$scope.dataDetailModal.hide();
				$scope.modal.show();
			}

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

		$scope.submitData = function () {

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
		}).then(function (modal) {
			$scope.dataDetailModal = modal;
		});


		$scope.closeModal = function (index) {
			if (index == 1) $scope.oModal1.hide();
			else $scope.oModal2.hide();
		};

		/* Listen for broadcasted messages */

		$scope.$on('modal.shown', function (event, modal) {
			console.log('Modal ' + modal.id + ' is shown!');
		});

		$scope.$on('modal.hidden', function (event, modal) {
			$scope.menuShown = true;
		});

		// Cleanup the modals when we're done with them (i.e: state change)
		// Angular will broadcast a $destroy event just before tearing down a scope
		// and removing the scope from its parent.
		$scope.$on('$destroy', function () {
			console.log('Destroying modals...');
			$scope.dataDetailModal.remove();
			$scope.modal.remove();
		});

	});
