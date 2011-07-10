/*

TODO

Update time in clocks (setInterval, on seconds, we update GMT, and then refresh the clocks...)
Bind the clocks times to an event???

make the separator (:) blink (toggle aclass?)

arrow cursor on text (bar is ugly)

append clock so they appear in chronologic order (past -present - future)

if the clock already exist, dont add it again...

clear the field when we add a city

when user press enter on suggestion, submit!

maybe auto-fill the field (instead of simply suggesting under...)

*/



function foo() {
	document.getElementById('clock').textContent = new Date();
	setTimeout(foo, 100);
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



function updateTime(){
	var here = new Date();
	var offset = here.getTimezoneOffset(); //returns 120 for 2 hours.
	gmt = new Date();
	gmt.setTime(here.getTime() + (offset*60000) );
	
	$('.clock').trigger('minuteChange'); //TODO: only call when minute change!
}



$(document).ready(function() {
	


	
	//sammy put route for the submit...
	
	
	
	//Load Json - init...
	$.getJSON('data/timezones.json', function(data) { //cached...
			sammy.tz = data;  
	});
	
	$.getJSON('data/cities.json', function(data) { //cached...
		sammy.cities = data;  
		var autocompleteItem = [];
	  $.each(data, function(key, val) {
	    autocompleteItem.push(val['ci']); //city name
			autocompleteItem.push(val['z']); //zone name
	  });
		autocompleteItem = removeDuplicateElement(autocompleteItem);
		
		// We init the auto-complete once we gathered all city + zones names.
		$("input#q").autocomplete({
			source: autocompleteItem,
			minLength: 1,
			delay: 0
		});
	});// eo get Json (init)
	
	
	setInterval(function() {
		updateTime();
	  // Do something every 1 seconds
	}, 1000);
	

updateTime();
	
	
	sammy = Sammy('body', function () {
		this.use(Sammy.Template, 'html'); //default uses .template file ext for templates
		this.use('Storage');
		this.use('Session');
		this.use('Title');
		this.use(Sammy.JSON);

		// HOMEPAGE
		this.get('/', function (context) {
			
			
		}); //end "get #/"
    
		
		
		this.post('#/post/q', function(context) {
			sammy.trigger('show-page', {page: 'links'});
			// alert(sammy.cities);
			str = this.params['q'];
		//	alert(str);
			
		//	var matchingItems = [];
			newCity = 0;
			possibleCities = [];
		  $.each(sammy.cities, function(key, val) {
				cityname = val['ci'];
				country = val['co'];
				
				
				if(str == cityname){ //todo, lowercase the comparaison, replace the dashes...
					//perfect match!
					//alert("perfect!" + val);
					newCity = val;
				}else if(0){ //we find if it may be a possible match
					if(str){	//indexof, without coma...
						possibleCities.push(val); //!!TOOD correct it
					}
				}else{
					//else we display the found options...
					//let the user pick...?
				}
			});//eo cities for each
			
				if(newCity){ //flag: if we found a good match, good enought to add it without further disambiguation...
					//We find which TZ this city relates to, and add it to the object.
					
					 $.each(sammy.tz, function(index_tz, data_tz) {
							if(data_tz['name'] == newCity['z']){ 
								//alert('name matches!' + newCity);
								newCity['tz'] = data_tz; //we embed the timezone object within the city one
							}else{
								//No timezone found for this city...
							}
					});//eo each tz
					
					cityTime = new Date();
					//TODO! We should take into account the daylight saving times!!
					cityTime.setTime(gmt.getTime() - ( newCity['tz']['off'] * 60000) );
					
					
					//Append the click DIV
					context.clocksDiv = context.$element('#clocks');
					//$(context.linkContainer).html('');
          context.render('templates/clock.html', {city: newCity, cityTime: cityTime})
            .appendTo(context.clocksDiv).then(function(content) {
							//TODO: init the analog clock here once the markup is there...
				
							
							$('.clock').bind('minuteChange', function() {
							  //alert('User clicked on "foo."');
								cityTime = new Date();
								//TODO! We should take into account the daylight saving times!!
								var offset = $(this).find('.offset').text();
								cityTime.setTime(gmt.getTime() - ( offset * 60000) );
								$(this).find('.hours').text(cityTime.getHours());
								$(this).find('.minutes').text(cityTime.getMinutes());
								$(this).find('.mili').text(cityTime.getTime());
								//todo: update Analog.
							});
							$('.clock').trigger('minuteChange');
							//init this clock's buttons
							//context.trigger('filter-item'); //if field is already populated (page refresh)
        	});
					
					
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
		
		
		
	});//eo sammy routes
		
		sammy.run('/');
		
}); //eo doc ready