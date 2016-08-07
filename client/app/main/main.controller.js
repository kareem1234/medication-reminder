'use strict';

angular.module('medicationReminderApp').controller('MainCtrl', function ($scope, $http, $window) {

    var start = moment().format('MM/DD/YYYY'),
        end = moment().add(1, 'day').format('MM/DD/YYYY');

    this.getMeds = ()=>{
    	$http.get('/api/medications?start=' + start + '&end=' + end).then( (meds)=> {
	    	console.log(meds);
	    	meds.data.forEach((med)=>{
	    		med.timeInt = moment(med.time).unix();
	    		med.time = moment(med.time).calendar();
	    	})
	        this.meds = meds.data;
	        this.meds.sort((a,b)=>{
	        	console.log(a.timeInt);
	        	return a.timeInt - b.timeInt;
	        });
    	});
    };

    $window.setInterval(function () {
        $scope.currentTime = moment().format('MMMM Do YYYY, h:mm:ss a');
        $scope.$apply();
    }, 1000);
    this.getMeds();

});
