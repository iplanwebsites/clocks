

function setTimeFormat(newFormat){
	// alert('set to ' + newFormat);
	if(newFormat == '24'){
		format = 'metric';
		//$('.city-time .format.metric').addClass('active');
		$('body').addClass('metric');
		$('body').removeClass('ampm');
	}else{
		format = 'ampm';
		//$('.city-time .format.ampm').addClass('active');
		$('body').removeClass('metric');
		$('body').addClass('ampm');
	}
	updateTime(1);
	//todo: save pref to a cookie...
}



function removeDuplicateElement(arrayName)
  {
  var newArray=new Array();
  label:for(var i=0; i<arrayName.length;i++ )
  {  
  for(var j=0; j<newArray.length;j++ )
  {
  if(newArray[j]==arrayName[i]) 
  continue label;
  }
  newArray[newArray.length] = arrayName[i];
  }
  return newArray;
}



function updateTime(forceTimeRefresh){
	var here = new Date();
	var offset = here.getTimezoneOffset(); //returns 120 for 2 hours.
	gmt = new Date();
	gmt.setTime(here.getTime() + (offset*60000) );
	
	//if( gmt.getSeconds() == 0){
		$('.clock').trigger('minuteChange'); //TODO: only call when minute change! OR when called from
//	}
	
	if( (gmt.getSeconds() % 2 == 0) || forceTimeRefresh ){
		$('.clock .sep').addClass('active');
	}else{
		$('.clock .sep').removeClass('active');
	}
	//TODO!! - debug this code...
	$('.city-time .format.active').removeClass('active');
	$('.city-time .format .ampm').addClass('active');
}





//fonctions fro the auto-complete...

function findValue(li) {
	if( li == null ) return alert("No match!");

	// if coming from an AJAX call, let's use the CityId as the value
	if( !!li.extra ) var sValue = li.extra[0];

	// otherwise, let's just display the value in the text box
	else var sValue = li.selectValue;

	alert("The value you selected was: " + sValue);
}

function selectItem(li) {
	//findValue(li);
	$('#search_form').submit();
//	alert('submited!!');
}

function formatItem(row) {
	return row[0] + " (id: " + row[1] + ")";
}

function lookupAjax(){
	var oSuggest = $("#CityAjax")[0].autocompleter;

	oSuggest.findValue();

	return false;
}

function lookupLocal(){
	var oSuggest = $("#CityLocal")[0].autocompleter;

	oSuggest.findValue();

	return false;
}



// eo autocomplete functions

$(document).ready(function() {
	
	
	
	
	
	
	// MODEL CODE...
	
	var TZ = Model("tz", function() {
	  this.persistence(Model.localStorage);
	});
	
	var City = Model("city", function() {
	  this.persistence(Model.localStorage);
	});
	
	
	var Clock = Model("clock", function() {
	  this.persistence(Model.localStorage);
	});



	
	  Clock.load(function() {
			//alert('loaded projetcs!');
	    // do something with the UI
	  })






$.getJSON('data/timezones.json', function(data) { //cached...
		sammy.tz = data;  
});


City.load(function() {
	//alert('loaded projetcs!');
  // do something with the UI
});



alert( City.count() );

if (City.count() == 0){ //if it'S not in cache...

$.getJSON('data/cities.json', function(data) { //cached...
	// sammy.cities = data;  
	//	var autocompleteItem = [];
  $.each(data, function(key, val) {
   // autocompleteItem.push(val['ci']); //city name
 
		var city = new City(val);
		city.attr("test", 1);
		city.save();
  }) //end of each...
});//eo json init
}//end if!

	alert( City.count() );
	
	autocompleteItem = ['paris', 'montreal']; //removeDuplicateElement(autocompleteItem);
	

// Start loop here
/*
	var clock = new Clock({ title: "stu22ff" });
	clokc.attr("title", "nonsense");
	clock.save();*/
	
// end JSOn loop here...
	
		
	//)};// eo get Json (init)
	
	
	
	$("input#q").autocompleteArray(
			autocompleteItem,
			{
				delay:10,
				minChars:1,
				matchSubset:1,
				onItemSelect:selectItem,
				onFindValue:findValue,
				autoFill:true,
				maxItemsToShow:10
			}
		);
		
	setInterval(function() {
		updateTime(0);
	  // Do something every 1 seconds
	}, 1000);
	

updateTime(1);
	
	//set action on buttons...
	
	$('#format_form .format').bind('touch click', function(){
		//we set the hidden field with the inner html (either 12 or 24)
		var format = $(this).html();
		setTimeFormat(format);
	});
	
	
	
	
	
	
	
	sammy = Sammy('body', function () {
		this.use(Sammy.Template, 'html'); //default uses .template file ext for templates
		this.use('Storage');
		this.use('Session');
		this.use('Title');
		this.use(Sammy.JSON);

		// LOAD ROUTE (homepage)
		this.get('/', function (context) {
			
			//rebuild clocks from cookie...
			
			CoolClock.findAndCreateClocks(); //create canvas for analog clocks.
			
			
			//TODO: find from cookie...
			setTimeFormat('24');
		}); //end "get #/"
    
		

		
		/////ADD ROUTE
		this.post('#/post/q', function(context) {
			$('#q').trigger('blur'); //fix for autocomplete to dissapear
			//sammy.trigger('show-page', {page: 'links'});
			str = this.params['q'];
			
			$('#q').val('').focus();
			
		//	var matchingItems = [];
			newCity = 0;
			possibleCities = [];
		  $.each(sammy.cities, function(key, val) {
				cityname = val['ci'];
				country = val['co'];
				
				//alert("str = "+ str);
				if(str.toLowerCase() == cityname.toLowerCase()){ //todo, lowercase the comparaison, replace the dashes...
					//perfect match!
					//alert("perfect!" + val);
					
					newCity = val;
				}else if(0){ //we find if it may be a possible match: clean comas...
					if(str){	//indexof, without coma...
						possibleCities.push(val); //!!TOOD correct it
					}
				}else{
					//else we display the found options...
					//let the user pick...?
				}
			});//eo cities for each
		//	alert('newCity = ' + newCity);
				if(newCity){ //flag: if we found a good match, good enought to add it without further disambiguation...
					//We find which TZ this city relates to, and add it to the object.
				//	alert('newCity = ' + newCity);
					 $.each(sammy.tz, function(index_tz, data_tz) {
							if(data_tz['name'] == newCity['z']){ 
								//alert('name matches!' + newCity);
								newCity['tz'] = data_tz; //we embed the timezone object within the city one
							}else{
								// newCity['tz'] = 0;
								//No timezone found for this city...
							}
					});//eo each tz
					
					//setting the display name (top of the box)
			
					if(! newCity['acronym']){
						newCity['acronym'] = newCity['ci'].split(',',1); //returns what's before coma only
						//newCity['accronym'] = newCity['accronym'].slice(0,8); //TODO: 8 chars maximum...
					}
					
					
					cityTime = new Date();
					//TODO! We should take into account the daylight saving times!!
					cityTime.setTime(gmt.getTime() - ( newCity['tz']['off'] * 60000) );
					
					
					
					//Append to the clock DIV
			//		alert('appending...');
			
			//find if this clock is already there...
			if( $('.clock h2[alt="'+newCity['ci']+'"]').length > 0){ //if the clock's already there...
				$('.clock h2[alt="'+newCity['ci']+'"]').parent().addClass('yellowfade').delay(500).queue(function(next){
				    $(this).removeClass("yellowfade");
				    next();
				});
			}else{ //if it's not present on page, we add it to DOM
			
					context.clocksDiv = context.$element('#clocks');
					
					
					
          context.render('templates/clock.html', {city: newCity, cityTime: cityTime})
            .prependTo(context.clocksDiv).then(function(content) {
							
				
					//	alert('THEN...');
							$('.clock').bind('minuteChange', function() {
								cityTime = new Date();
								//TODO! We should take into account the daylight saving times!!
								var offset = $(this).find('.offset').text();
								cityTime.setTime(gmt.getTime() - ( offset * 60000) );
								
								var h = cityTime.getHours();
								if(format == 'ampm'){
									// http://en.wikipedia.org/wiki/24-hour_clock
									if( (h <= 11) && (h >= 0)){
										var ampm = 'am';
										$(this).addClass('am');
										$(this).removeClass('pm');
									}else{
										var ampm = 'pm';
										$(this).addClass('pm');
										$(this).removeClass('am');
										
									}
									h = h % 12;
									if (h == 0){ h = 12; } //we dont's show 0:12 in am-pm format...
								}
								$(this).find('.hours').text(h);
								var strMinutes = cityTime.getMinutes();

								if(strMinutes < 10){ strMinutes = '0'+strMinutes;	} //prepend a zero if 1 digit
								$(this).find('.minutes').text(strMinutes);
								$(this).find('.mili').text(cityTime.getTime());
								//todo: update Analog.
							});
							$('.clock').trigger('minuteChange');
							CoolClock.findAndCreateClocks();
							
							//animate bg...
							$('.clock.fadein').removeClass('fadein'); //we remove the class, animating in css3
							
							//init this clock's buttons
							//context.trigger('filter-item'); //if field is already populated (page refresh)
        	}); // eo appending
				
				} // eo if clock already there
					
				//init the new clock...
				
				
				//alert('here = '+offset+ ':'+here.getHours() + ':'+here.getMinutes() );
					/*  
					var MS_PER_MINUTE = 60000;
					var myStartDate = new Date(myEndDateTime - durationInMinutes * MS_PER_MINUTE);
					
					var d1 = new Date();
					var d2 = new Date(2006, 6, 7);
					var day = 1000*60*60*24;
					var diff = Math.ceil((d2.getTime()-d1.getTime())/(day));
					document.write("Days until vacation: " + diff);
					*/
				}
		    //matchingItems.push(val['ci']); //city name
		 
			
			/*
			if( perfectMatch( str ) ) {	//check if there's a perfect matching city / zone name
				//sammy.trigger('add-url', {url: str});//add URL
				//this.title('added: "'+str+'"');
			}else{
				// this.title('filter: '+str);
				// sammy.trigger('filter-item');
			}*/
			return false; //event.preventDefault(); 
		});
		
		/////DELETE ROUTE
		this.del('#/del/clock', function (context) {
			var toDelete = this.params['clock_name'];
			//remove clock, according to hidden field value!
			$('.clock h2[alt="'+toDelete+'"]').parent().addClass('fadein').delay(200).queue(function(next){
			    $(this).hide(0); //just because it runs faster than the entire remove function
					$(this).remove();
			    next();
			});
			//alert(toDelete);
			
		}); //end "del #/del/clock"
		
		
	});//eo sammy routes
		
		sammy.run('/');
		
 }); //eo doc ready


