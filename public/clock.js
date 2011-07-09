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
	  var autocompleteItem = [];
	  $.each(data, function(key, val) {
	    autocompleteItem.push(val['ci']); //city name
			autocompleteItem.push(val['z']); //zone name
	  });

		autocompleteItem = removeDuplicateElement(autocompleteItem);
		
// We init the auto-complete once we gathered all city + zones names.
$("input#autocomplete").autocomplete({
	source: autocompleteItem,
	minLength: 1,
	delay: 0
});

	});
	
	
    
		
		
		
		
});