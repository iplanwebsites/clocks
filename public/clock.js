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


$(document).ready(function() {
	
	
	//sammy put route for the submit...
	
	
	
	//Load Json - init...
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
	
	
	
	
	
	sammy = Sammy('body', function () {
		this.use(Sammy.Template, 'html'); //default uses .template file ext for templates
		this.use('Storage');
		this.use('Session');
		this.use('Title');
		this.use(Sammy.JSON);

		// HOMEPAGE
		this.get('#!/', function (context) {
			
			
		}); //end "get #/"
    
		
		
		this.put('#/post/q', function(context) {
			sammy.trigger('show-page', {page: 'links'});
			alert(sammy.cities);
			str = this.params['q'];
			alert(str);
			
			var matchingItems = [];
		  $.each(sammy.cities, function(key, val) {
				cityname = val['ci'];
				country = val['co'];
				
				if(str == cityname){
					//perfect match!
				}else{ 
					//indexof...
				}
		    matchingItems.push(val['ci']); //city name
		  });
			
			
			if( perfectMatch( str ) ) {	//check if there's a perfect matching city / zone name
				//sammy.trigger('add-url', {url: str});//add URL
				//this.title('added: "'+str+'"');
			}else{
				// this.title('filter: '+str);
				// sammy.trigger('filter-item');
			}
			return false; //event.preventDefault(); 
		});
		
		
		
	});//eo sammy routes
		
		sammy.run('#/');
		
}); //eo doc ready