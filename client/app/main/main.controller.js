'use strict';

angular.module('medicationReminderApp').controller('MainCtrl', function ($scope, $http, $window,ngAudio) {

	this.start = moment().format('MM/DD/YYYY');
	this.end =  moment().add(1, 'day').format('MM/DD/YYYY');
    this.missedMeds = [];
    this.meds = [];
    this.medCache = {};
    // no internet explorer support for wav
    this.warning1 = ngAudio.load("../assets/audio/echo_alert.wav");
    this.warning2 = ngAudio.load("../assets/audio/click_alert.wav");

    // wait for audio object to load before setting props
    // interface doesnt seem to provide callback
    setTimeout(()=>{
    	this.warning1.volume = 0.5;
    	this.warning1.loop= 10;
    	this.warning2.volume = 1;
    	this.warning2.loop =10;
    },400);
    // handle date update
    $scope.$on('newDate',(event,date)=>{
        let newDate = date.clone();
    	this.start = newDate.format('MM/DD/YYYY');
    	this.end = newDate.add(1, 'day').format('MM/DD/YYYY');
    	this.missedMeds = [];
    	this.meds = [];
    	this._getMeds();

    });
    // on medicate take button click
    this.take = (med,index)=>{
    	this.meds[index].take = false;
    	this.meds[index].hasTaken = true;
    }
    // get a list of meds
    this._getMeds = ()=>{
    	$http.get('/api/medications?start=' + this.start + '&end=' + this.end).then( (meds)=> {
    		this.meds = [];
    		this.missedMeds = [];
	    	meds.data.forEach((med)=>{
	    		med.timeInt = moment(med.time).unix();
	    		med.time = moment(med.time).calendar();
	    	})
	        meds.data.sort((a,b)=>{
	        	return a.timeInt - b.timeInt;
	        });
	        this.meds = meds.data;
	        this._checkMeds();
	        console.log(this.meds);
    	});
    };
    // check if already have this medication in cash
    this._cacheMed = (med)=>{
    	if(this.medCache[med._id]){
    		console.log("EXIST");
    		return this.medCache[med._id];
    	}
    	else{
    		this.medCache[med._id] = med;
    		return med;
    	}	
    }
    //wrapper called on each med in list
    this._checkMeds = ()=>{
    	this.meds.forEach((med,index,array)=>{
    		med = this._cacheMed(med);
    		this._shouldTake(med);
    		this._isMissed(med);
    		array[index] = med;
    		//console.log(this.missedMeds.length);
    	});
    };
    //check if its time to take med
    this._shouldTake = (med)=>{
    	var isLess = (moment().add(5, 'minutes').unix() > med.timeInt);
    	var isGreater = (moment().subtract(5, 'minutes').unix() <= med.timeInt);
    	var take = (isLess && isGreater);
    	if(!med.take && take){
    		this.warning1.play();
            this.warning1.loop = 10;
        }
    	med.take = take;
    };
    //check if med should be added to missed list
    this._isMissed = (med)=>{
    	var miss = ((moment().subtract(5, 'minutes').unix() >  med.timeInt) );
    	if( miss && !med.hasTaken && !med.missed){
    		med.missed = true;
    		this.missedMeds.push(med);
            console.log(med.timeInt,moment().unix());
            console.log((moment().unix() - med.timeInt),(moment().add(10, 'minutes') - moment()));
    		if((moment().unix() - med.timeInt) <= (moment().add(10, 'minutes').unix() - moment().unix())){
    			this.warning2.play();
                this.warning2.loop = 10;
    		}
    	}
    	else if(med.missed){
    		 this.missedMeds.push(med);
    	}
    	
    };
    this._contains = (med,array)=>{
    	return array.find((md)=>{return _.isEqual(md, med)});
    };

    // check if we need to take meds every minute
    $window.setInterval(()=>{
        this._getMeds();
    }, 1000*60);
    this._getMeds();

});
