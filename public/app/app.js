
angular.module('utils', []).filter('index', function () {
    return function (array, index) {
        if (!index)
            index = 'index';
        for (var i = 0; i < array.length; ++i) {
            array[i][index] = i;
        }
        return array;
    };
});
var app = angular.module('PostageTracker', ['ui.router', 'camelCaseToHuman', 'utils']);

app.config(function($stateProvider) {

	$stateProvider
	.state('index', {
		url:'',
		templateUrl: 'app/views/home.html',
		controller: 'transactionsController'
	})

});

app.factory('bankBalanceFactory', ['$http', function($http) {
	var urlBase = '/api/bankbalance';

	var factory = {};
	factory.getBalance = function() {
		return $http.get(urlBase);
	};
	factory.setBalance = function(balance) {
		return $http.post(urlBase, balance);
	};
	return factory;

}]);

app.factory('transactionsFactory', ['$http', function($http) {
	var urlBase = '/api/transactions';

	var factory = {};
	factory.getTransactions = function() {
		return $http.get(urlBase);
	};
	factory.postTransaction = function(transaction) {
		return $http.post(urlBase, transaction);
	};
	factory.putTransaction = function(transaction) {
		return $http.put(urlBase + '/' + transaction._id, transaction);
	};
	factory.deleteTransaction = function(transaction) {
		return $http.delete(urlBase + '/' + transaction._id, transaction);
	};
	return factory;
}]);

app.controller('transactionsController', ['$scope', '$http', '$filter', 'transactionsFactory', 'bankBalanceFactory', function($scope, $http, $filter, transactionsFactory, bankBalanceFactory) {

	function init() {
		bankBalanceFactory.getBalance()
			.success(
				function(bankbalance) {
					$scope.balance = bankbalance[0];
				}
			)
			.error(
				function(error) {
					$scope.status = 'Unable to load balance data: ' + error.message;
				});

		transactionsFactory.getTransactions()
			.success(
				function(data) {

					data.forEach(function(item){
						// make sure returned date string from MongoDB is rehydrated into
						// a proper Date object on client side
						item.date = new Date(item.date);
					});

					$scope.transactions = data;
				})
			.error(
				function(error) {
					$scope.status = 'Unable to load transaction data: ' + error.message;
				});	
	}
	init();

	/*	--------------------------------------------------------------
	 *  FILTERS AND VIEW STATE
	 *	--------------------------------------------------------------*/

	function setBankBalance(balance) {
		bankBalanceFactory.setBalance(balance);
	}
	$scope.setBankBalance = setBankBalance;

	//	DATES 	--------------------------------------------------------------
	$scope.datevalue = {
		value: new Date()
	}

	$scope.thisyear = {
		value: new Date()
	}

	$scope.lastyear = {
		value: new Date($scope.datevalue.value.setMonth($scope.datevalue.value.getMonth() - 12))
	}

	$scope.formatDate = function(date) {
		return new Date(date);
	}


	//	SORTING	--------------------------------------------------------------
	$scope.sortBy = 'date';

	$scope.reverse = false;

	$scope.doSort = function(propName) {
		$scope.sortBy = propName;
		$scope.reverse = !$scope.reverse;

		console.log($filter('orderBy')($scope.transactions, propName, $scope.reverse));
	}


	//	VIEW STATE -----------------------------------------------------------
	function resetFilter() {
		$scope.transactionFilter = "";
	}
	$scope.resetFilter = resetFilter;

	$scope.isEditing = false;

	$scope.isCreating = false;

	$scope.editedTransaction = null;


	/*	--------------------------------------------------------------
	 *  CRUD FUNCTIONS
	 *	--------------------------------------------------------------*/


	//	POST 	--------------------------------------------------------------
	function addTransaction(newTransaction) {
		transactionsFactory.postTransaction(newTransaction)
			.success(
				function(transaction) {
					$scope.transactions.push(transaction);			
				}
			)
			.error(
				function(error) {
					$scope.status = 'Unable to add new transaction: ' + error.message;
				}
			)

		resetAllTransactionForms();
		$scope.isCreating = false;
	}
	$scope.add = addTransaction;


	//	PUT 	--------------------------------------------------------------
	function editTransaction(editedTransaction) {
		transactionsFactory.putTransaction(editedTransaction)
			.success(
				function(transaction) {
					var index = _.findIndex($scope.transactions, function(transaction) {
						return transaction._id == editedTransaction._id;
					});
					$scope.transactions[index] = editedTransaction;
					$scope.transactions.push(transaction);
				}
			)
			.error(
				function(error) {
					$scope.status = 'Unable to add new transaction: ' + error.message;
				}
			)

		resetAllTransactionForms();
	}
	$scope.edit = editTransaction;

	$scope.setEditedTransaction = function(transaction) {
		resetAllTransactionForms();
		transaction.isSelected = true;
		$scope.isEditing = true;

		$scope.editedTransaction = angular.copy(transaction);
		$scope.editedTransaction.date = new Date($scope.editedTransaction.date);
	}


	//	FORM RESET FUNCTIONS 	--------------------------------------------------------------

	function setNewTransaction() {
		resetAllTransactionForms();
		$scope.isCreating = true;
	}
	$scope.setNewTransaction = setNewTransaction;

	function resetNewTransactionForm() {
		$scope.newTransaction = {};
		$scope.newTransaction.date = new Date();
		$scope.isCreating = false;
	}

	function resetEditTransactionForm() {
		$scope.editedTransaction = null;
		$scope.isEditing = false;
	}
	
	// Any click event to update or create a new transaction record should clear the forms to avoid confusion/error.
	function resetAllTransactionForms() {
		for ( var i = 0; i < $scope.transactions.length; i++ ) {
			$scope.transactions[i].isSelected = false;
		}
		resetEditTransactionForm();
		resetNewTransactionForm();
	}
	$scope.resetAllTransactionForms = resetAllTransactionForms;

	//	DELETE	--------------------------------------------------------------
	function deleteTransaction(deletedTransaction) {
		if (confirm('Are you sure you want to delete this transaction?')) {
			transactionsFactory.deleteTransaction(deletedTransaction)
			.success(
				function() {
					var index = _.findIndex($scope.transactions, function(transaction) {
						return transaction._id == deletedTransaction._id;
					});
					$scope.transactions.splice(index, 1)	
				}
			)
			.error(
				function(error) {
					$scope.status = 'Unable to delete transaction: ' + error.message;
				}
			)
		}
	}
	$scope.delete = deleteTransaction;

}]);

app.filter('salesRepFilter', function() {
	return function(items, salesRepCheckboxtom, salesRepCheckboxbob) {

		if (!items) {
  			return;
  		}

		var result = [];

		for (var i=0; i < items.length; i++) {
			if (items[i].salesRep === salesRepCheckboxtom || items[i].salesRep === salesRepCheckboxbob) {
				result.push(items[i]);
			}
		}

		return result;
	}
});

app.filter("dateRangeFilter", function() {
  return function(items, from, to) {

  		if (!items) {
  			return;
  		}

  		if ( from == "" ) {
  			return;
  		} else if ( to === null ) {
  			to = new Date();
  		}

        var df = new Date(from);
        var dt = new Date(to);

        //Decrement 'from' date by one and increment 'to' date by one to be inclusive of range.
        //Date objects are weird.
        df.setDate(df.getDate() -1);
        dt.setDate(dt.getDate() +1);

        var result = [];        
        for (var i=0; i<items.length; i++){
            var itemDate = new Date(items[i].date);
                
            if (itemDate > df && itemDate < dt)  {
                result.push(items[i]);
            }
        }  
                
        return result;
  };
});