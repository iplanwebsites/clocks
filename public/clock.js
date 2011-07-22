/*

TODO

download a font package from font-squirrel (cachable)

Update time in clocks (setInterval, on seconds, we update GMT, and then refresh the clocks...)

make the separator (:) blink (toggle aclass?)

arrow cursor on text (bar is ugly)

re-order clock so they appear in chronologic order (past -present - future)

if the clock already exist, dont add it again...



position and stretch the clocks all dynamically, so they always fill all the screen: 
 - may not be possible to keep everything relative in size
 - can the canvas be stretched: yes, but there aliasing, it's not vector...

find a "slugify" function, and use it to generate IDS based on name (lowercase, and special_chars_cleanup)


Autocomplete: 
 - when user press enter on suggestion, submit!
 - maybe auto-fill the field (instead of simply suggesting under...)

set a BG image on the delete submit button..

On a mouse device only, we only show the delete option when the clock is overed (it shows option).
 - On touch device, options are always there, or just hidden (simpler app.)


12/24 format
 - bind js action onto these buttons
 - should it submit a form? no, just a post... can it be radios???
 - radio that autosubmit the form when changed...



todo: add timezones in the autocomplete and support for them...

todo: add alternate spelling for major cities... (localized + accronyms)


todo: position in css all time digit statically (with left and right alignement...)

todo: rollover bug with fadein colcks (just added ones...)

todo: data: add a top hit value, so we suggest more important cities first.

*/

/*

function foo() {
	document.getElementById('clock').textContent = new Date();
	setTimeout(foo, 100);
}
*/

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
			// autocompleteItem.push(val['z']); //zone name !! TODO!!
	  });
		autocompleteItem = removeDuplicateElement(autocompleteItem);
		
		// We init the auto-complete once we gathered all city + zones names.
		
		/* OLD VERSION JQ-UI
		$("input#q").autocomplete({
			source: autocompleteItem,
			minLength: 1,
			delay: 0
		});
		*/
		
		
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
		//});
		
		
		
	});// eo get Json (init)
	
	
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
					context.clocksDiv = context.$element('#clocks');
					//$(context.linkContainer).html('');
          context.render('templates/clock.html', {city: newCity, cityTime: cityTime})
            .prependTo(context.clocksDiv).then(function(content) {
							//TODO: init the analog clock here once the markup is there...
				
					//	alert('THEN...');
							$('.clock').bind('minuteChange', function() {
								cityTime = new Date();
								//TODO! We should take into account the daylight saving times!!
								var offset = $(this).find('.offset').text();
								cityTime.setTime(gmt.getTime() - ( offset * 60000) );
								
								var h = cityTime.getHours();
								if(format == 'ampm'){
									if(h > 12){
										var ampm = 'pm';
										$(this).addClass('pm');
										$(this).removeClass('am');
									}else{
										var ampm = 'am';
										$(this).addClass('am');
										$(this).removeClass('pm');
									}
									h = h % 12;
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
		
		/////DELETE ROUTE
		this.del('#/del/clock', function (context) {
			var toDelete = this.params['clock_name'];
			//remove clock, according to hidden field value!
			alert(toDelete);
			
		}); //end "del #/del/clock"
		
		
	});//eo sammy routes
		
		sammy.run('/');
		
}); //eo doc ready