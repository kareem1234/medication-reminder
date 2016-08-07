'use strict';

angular.module('medicationReminderApp').controller('MainCtrl', function ($scope, $http, $window) {


    this.missedMeds = [];
    this.meds = null;

    this.getMeds = ()=>{
    	var start = moment().format('MM/DD/YYYY'),
        end = moment().add(1, 'day').format('MM/DD/YYYY');
    	console.log('getting meds');
    	$http.get('/api/medications?start=' + start + '&end=' + end).then( (meds)=> {
	    	console.log(meds);
	    	meds.data.forEach((med)=>{
	    		med.timeInt = moment(med.time).unix();
	    		med.time = moment(med.time).calendar();
	    	})
	        this.meds = meds.data;
	        this.meds.sort((a,b)=>{
	        	return a.timeInt - b.timeInt;
	        });
    	});
    };
    this._shouldTake = (med)=>{
    	var isLess = (moment().add(5, 'minutes').unix() >= med.timeInt);
    	var isGreater = (moment().subtract(5, 'minutes').unix() <= med.timeInt);
    	return (isLess && isGreater);
    }
    this.checkMeds = ()=>{
    	var newMeds = [];
    	this.meds.forEach((med)=>{
    		med.take = this._shouldTake(med);
    		if(this._isMissed(med))
    			this.missedMeds.push(med);
    		else
    			newMeds.push(med);
    	});
    	this.meds = newMeds;
    }
    this._isMissed = (med)=>{
    	return (moment().unix() > moment(med.timeInt).unix());
    }

    $window.setInterval(()=>{
        this.getMeds();
    }, 1000*60);
    this.getMeds();

});
