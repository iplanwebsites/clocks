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


*/

/*

function foo() {
	document.getElementById('clock').textContent = new Date();
	setTimeout(foo, 100);
}
*/

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
	
	if( gmt.getSeconds() == 0){
		$('.clock').trigger('minuteChange'); //TODO: only call when minute change!
	}
	
	if( gmt.getSeconds() % 2 == 0){
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
	alert('submit!!');
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
			autocompleteItem.push(val['z']); //zone name
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
				[
					"Aberdeen", "Ada", "Adamsville", "Addyston", "Adelphi", "Adena", "Adrian", "Akron",
					"Albany", "Alexandria", "Alger", "Alledonia", "Alliance", "Alpha", "Alvada",
					"Alvordton", "Amanda", "Amelia", "Amesville", "Amherst", "Amlin", "Amsden",
					"Amsterdam", "Andover", "Anna", "Ansonia", "Antwerp", "Apple Creek", "Arcadia",
					"Arcanum", "Archbold", "Arlington", "Ashland", "Ashley", "Ashtabula", "Ashville",
					"Athens", "Attica", "Atwater", "Augusta", "Aurora", "Austinburg", "Ava", "Avon",
					"Avon Lake", "Bainbridge", "Bakersville", "Baltic", "Baltimore", "Bannock",
					"Barberton", "Barlow", "Barnesville", "Bartlett", "Barton", "Bascom", "Batavia",
					"Bath", "Bay Village", "Beach City", "Beachwood", "Beallsville", "Beaver",
					"Beaverdam", "Bedford", "Bellaire", "Bellbrook", "Belle Center", "Belle Valley",
					"Bellefontaine", "Bellevue", "Bellville", "Belmont", "Belmore", "Beloit", "Belpre",
					"Benton Ridge", "Bentonville", "Berea", "Bergholz", "Berkey", "Berlin",
					"Berlin Center", "Berlin Heights", "Bethel", "Bethesda", "Bettsville", "Beverly",
					"Bidwell", "Big Prairie", "Birmingham", "Blacklick", "Bladensburg", "Blaine",
					"Blakeslee", "Blanchester", "Blissfield", "Bloomdale", "Bloomingburg",
					"Bloomingdale", "Bloomville", "Blue Creek", "Blue Rock", "Bluffton",
					"Bolivar", "Botkins", "Bourneville", "Bowerston", "Bowersville",
					"Bowling Green", "Bradford", "Bradner", "Brady Lake", "Brecksville",
					"Bremen", "Brewster", "Brice", "Bridgeport", "Brilliant", "Brinkhaven",
					"Bristolville", "Broadview Heights", "Broadway", "Brookfield", "Brookpark",
					"Brookville", "Brownsville", "Brunswick", "Bryan", "Buchtel", "Buckeye Lake",
					"Buckland", "Bucyrus", "Buffalo", "Buford", "Burbank", "Burghill", "Burgoon",
					"Burkettsville", "Burton", "Butler", "Byesville", "Cable", "Cadiz", "Cairo",
					"Caldwell", "Caledonia", "Cambridge", "Camden", "Cameron", "Camp Dennison",
					"Campbell", "Canal Fulton", "Canal Winchester", "Canfield", "Canton", "Carbon Hill",
					"Carbondale", "Cardington", "Carey", "Carroll", "Carrollton", "Casstown",
					"Castalia", "Catawba", "Cecil", "Cedarville", "Celina", "Centerburg",
					"Chagrin Falls", "Chandlersville", "Chardon", "Charm", "Chatfield", "Chauncey",
					"Cherry Fork", "Chesapeake", "Cheshire", "Chester", "Chesterhill", "Chesterland",
					"Chesterville", "Chickasaw", "Chillicothe", "Chilo", "Chippewa Lake",
					"Christiansburg", "Cincinnati", "Circleville", "Clarington", "Clarksburg",
					"Clarksville", "Clay Center", "Clayton", "Cleveland", "Cleves", "Clifton",
					"Clinton", "Cloverdale", "Clyde", "Coal Run", "Coalton", "Coldwater", "Colerain",
					"College Corner", "Collins", "Collinsville", "Colton", "Columbia Station",
					"Columbiana", "Columbus", "Columbus Grove", "Commercial Point", "Conesville",
					"Conneaut", "Conover", "Continental", "Convoy", "Coolville", "Corning", "Cortland",
					"Coshocton", "Covington", "Creola", "Crestline", "Creston", "Crooksville",
					"Croton", "Crown City", "Cuba", "Cumberland", "Curtice", "Custar", "Cutler",
					"Cuyahoga Falls", "Cygnet", "Cynthiana", "Dalton", "Damascus", "Danville",
					"Dayton", "De Graff", "Decatur", "Deerfield", "Deersville", "Defiance",
					"Delaware", "Dellroy", "Delphos", "Delta", "Dennison", "Derby", "Derwent",
					"Deshler", "Dexter City", "Diamond", "Dillonvale", "Dola", "Donnelsville",
					"Dorset", "Dover", "Doylestown", "Dresden", "Dublin", "Dunbridge", "Duncan Falls",
					"Dundee", "Dunkirk", "Dupont", "East Claridon", "East Fultonham",
					"East Liberty", "East Liverpool", "East Palestine", "East Rochester",
					"East Sparta", "East Springfield", "Eastlake", "Eaton", "Edgerton", "Edison",
					"Edon", "Eldorado", "Elgin", "Elkton", "Ellsworth", "Elmore", "Elyria",
					"Empire", "Englewood", "Enon", "Etna", "Euclid", "Evansport", "Fairborn",
					"Fairfield", "Fairpoint", "Fairview", "Farmdale", "Farmer", "Farmersville",
					"Fayette", "Fayetteville", "Feesburg", "Felicity", "Findlay", "Flat Rock",
					"Fleming", "Fletcher", "Flushing", "Forest", "Fort Jennings", "Fort Loramie",
					"Fort Recovery", "Fostoria", "Fowler", "Frankfort", "Franklin",
					"Franklin Furnace", "Frazeysburg", "Fredericksburg", "Fredericktown",
					"Freeport", "Fremont", "Fresno", "Friendship", "Fulton", "Fultonham",
					"Galena", "Galion", "Gallipolis", "Galloway", "Gambier", "Garrettsville",
					"Gates Mills", "Geneva", "Genoa", "Georgetown", "Germantown", "Gettysburg",
					"Gibsonburg", "Girard", "Glandorf", "Glencoe", "Glenford", "Glenmont",
					"Glouster", "Gnadenhutten", "Gomer", "Goshen", "Grafton", "Grand Rapids",
					"Grand River", "Granville", "Gratiot", "Gratis", "Graysville", "Graytown",
					"Green", "Green Camp", "Green Springs", "Greenfield", "Greenford",
					"Greentown", "Greenville", "Greenwich", "Grelton", "Grove City",
					"Groveport", "Grover Hill", "Guysville", "Gypsum", "Hallsville",
					"Hamden", "Hamersville", "Hamilton", "Hamler", "Hammondsville",
					"Hannibal", "Hanoverton", "Harbor View", "Harlem Springs", "Harpster",
					"Harrisburg", "Harrison", "Harrisville", "Harrod", "Hartford", "Hartville",
					"Harveysburg", "Haskins", "Haverhill", "Haviland", "Haydenville", "Hayesville",
					"Heath", "Hebron", "Helena", "Hicksville", "Higginsport", "Highland", "Hilliard",
					"Hillsboro", "Hinckley", "Hiram", "Hockingport", "Holgate", "Holland",
					"Hollansburg", "Holloway", "Holmesville", "Homer", "Homerville", "Homeworth",
					"Hooven", "Hopedale", "Hopewell", "Houston", "Howard", "Hoytville", "Hubbard",
					"Hudson", "Huntsburg", "Huntsville", "Huron", "Iberia", "Independence",
					"Irondale", "Ironton", "Irwin", "Isle Saint George", "Jackson", "Jackson Center",
					"Jacksontown", "Jacksonville", "Jacobsburg", "Jamestown", "Jasper",
					"Jefferson", "Jeffersonville", "Jenera", "Jeromesville", "Jerry City",
					"Jerusalem", "Jewell", "Jewett", "Johnstown", "Junction City", "Kalida",
					"Kansas", "Keene", "Kelleys Island", "Kensington", "Kent", "Kenton",
					"Kerr", "Kettlersville", "Kidron", "Kilbourne", "Killbuck", "Kimbolton",
					"Kings Mills", "Kingston", "Kingsville", "Kinsman", "Kipling", "Kipton",
					"Kirby", "Kirkersville", "Kitts Hill", "Kunkle", "La Rue", "Lacarne",
					"Lafayette", "Lafferty", "Lagrange", "Laings", "Lake Milton", "Lakemore",
					"Lakeside Marblehead", "Lakeview", "Lakeville", "Lakewood", "Lancaster",
					"Langsville", "Lansing", "Latham", "Latty", "Laura", "Laurelville",
					"Leavittsburg", "Lebanon", "Lees Creek", "Leesburg", "Leesville",
					"Leetonia", "Leipsic", "Lemoyne", "Lewis Center", "Lewisburg",
					"Lewistown", "Lewisville", "Liberty Center", "Lima", "Limaville",
					"Lindsey", "Lisbon", "Litchfield", "Lithopolis", "Little Hocking",
					"Lockbourne", "Lodi", "Logan", "London", "Londonderry",
					"Long Bottom", "Lorain", "Lore City", "Loudonville", "Louisville",
					"Loveland", "Lowell", "Lowellville", "Lower Salem", "Lucas",
					"Lucasville", "Luckey", "Ludlow Falls", "Lynchburg", "Lynx",
					"Lyons", "Macedonia", "Macksburg", "Madison", "Magnetic Springs",
					"Magnolia", "Maineville", "Malaga", "Malinta", "Malta", "Malvern",
					"Manchester", "Mansfield", "Mantua", "Maple Heights", "Maplewood",
					"Marathon", "Marengo", "Maria Stein", "Marietta", "Marion",
					"Mark Center", "Marshallville", "Martel", "Martin", "Martins Ferry",
					"Martinsburg", "Martinsville", "Marysville", "Mason", "Massillon",
					"Masury", "Maumee", "Maximo", "Maynard", "Mc Arthur", "Mc Clure",
					"Mc Comb", "Mc Connelsville", "Mc Cutchenville", "Mc Dermott",
					"Mc Donald", "Mc Guffey", "Mechanicsburg", "Mechanicstown",
					"Medina", "Medway", "Melmore", "Melrose", "Mendon", "Mentor",
					"Mesopotamia", "Metamora", "Miamisburg", "Miamitown", "Miamiville",
					"Middle Bass", "Middle Point", "Middlebranch", "Middleburg",
					"Middlefield", "Middleport", "Middletown", "Midland", "Midvale",
					"Milan", "Milford", "Milford Center", "Millbury", "Milledgeville",
					"Miller City", "Millersburg", "Millersport", "Millfield",
					"Milton Center", "Mineral City", "Mineral Ridge", "Minerva",
					"Minford", "Mingo", "Mingo Junction", "Minster", "Mogadore",
					"Monclova", "Monroe", "Monroeville", "Montezuma", "Montpelier",
					"Montville", "Morral", "Morristown", "Morrow", "Moscow",
					"Mount Blanchard", "Mount Cory", "Mount Eaton", "Mount Gilead",
					"Mount Hope", "Mount Liberty", "Mount Orab", "Mount Perry",
					"Mount Pleasant", "Mount Saint Joseph", "Mount Sterling",
					"Mount Vernon", "Mount Victory", "Mowrystown", "Moxahala",
					"Munroe Falls", "Murray City", "Nankin", "Napoleon", "Nashport",
					"Nashville", "Navarre", "Neapolis", "Neffs", "Negley",
					"Nelsonville", "Nevada", "Neville", "New Albany", "New Athens",
					"New Bavaria", "New Bloomington", "New Bremen", "New Carlisle",
					"New Concord", "New Hampshire", "New Haven", "New Holland",
					"New Knoxville", "New Lebanon", "New Lexington", "New London",
					"New Madison", "New Marshfield", "New Matamoras", "New Middletown",
					"New Paris", "New Philadelphia", "New Plymouth", "New Richmond",
					"New Riegel", "New Rumley", "New Springfield", "New Straitsville",
					"New Vienna", "New Washington", "New Waterford", "New Weston",
					"Newark", "Newbury", "Newcomerstown", "Newport", "Newton Falls",
					"Newtonsville", "Ney", "Niles", "North Baltimore", "North Bend",
					"North Benton", "North Bloomfield", "North Fairfield",
					"North Georgetown", "North Hampton", "North Jackson",
					"North Kingsville", "North Lawrence", "North Lewisburg",
					"North Lima", "North Olmsted", "North Ridgeville", "North Robinson",
					"North Royalton", "North Star", "Northfield", "Northwood", "Norwalk",
					"Norwich", "Nova", "Novelty", "Oak Harbor", "Oak Hill", "Oakwood",
					"Oberlin", "Oceola", "Ohio City", "Okeana", "Okolona", "Old Fort",
					"Old Washington", "Olmsted Falls", "Ontario", "Orangeville",
					"Oregon", "Oregonia", "Orient", "Orrville", "Orwell", "Osgood",
					"Ostrander", "Ottawa", "Ottoville", "Otway", "Overpeck",
					"Owensville", "Oxford", "Painesville", "Palestine", "Pandora",
					"Paris", "Parkman", "Pataskala", "Patriot", "Paulding", "Payne",
					"Pedro", "Peebles", "Pemberton", "Pemberville", "Peninsula",
					"Perry", "Perrysburg", "Perrysville", "Petersburg", "Pettisville",
					"Phillipsburg", "Philo", "Pickerington", "Piedmont", "Pierpont",
					"Piketon", "Piney Fork", "Pioneer", "Piqua", "Pitsburg",
					"Plain City", "Plainfield", "Pleasant City", "Pleasant Hill",
					"Pleasant Plain", "Pleasantville", "Plymouth", "Polk",
					"Pomeroy", "Port Clinton", "Port Jefferson", "Port Washington",
					"Port William", "Portage", "Portland", "Portsmouth", "Potsdam",
					"Powell", "Powhatan Point", "Proctorville", "Prospect", "Put in Bay",
					"Quaker City", "Quincy", "Racine", "Radnor", "Randolph", "Rarden",
					"Ravenna", "Rawson", "Ray", "Rayland", "Raymond", "Reedsville",
					"Reesville", "Reno", "Republic", "Reynoldsburg", "Richfield",
					"Richmond", "Richmond Dale", "Richwood", "Ridgeville Corners",
					"Ridgeway", "Rio Grande", "Ripley", "Risingsun", "Rittman",
					"Robertsville", "Rock Camp", "Rock Creek", "Rockbridge", "Rockford",
					"Rocky Ridge", "Rocky River", "Rogers", "Rome", "Rootstown", "Roseville",
					"Rosewood", "Ross", "Rossburg", "Rossford", "Roundhead", "Rudolph",
					"Rushsylvania", "Rushville", "Russells Point", "Russellville", "Russia",
					"Rutland", "Sabina", "Saint Clairsville", "Saint Henry", "Saint Johns",
					"Saint Louisville", "Saint Marys", "Saint Paris", "Salem", "Salesville",
					"Salineville", "Sandusky", "Sandyville", "Sarahsville", "Sardinia",
					"Sardis", "Savannah", "Scio", "Scioto Furnace", "Scott", "Scottown",
					"Seaman", "Sebring", "Sedalia", "Senecaville", "Seven Mile", "Seville",
					"Shade", "Shadyside", "Shandon", "Sharon Center", "Sharpsburg",
					"Shauck", "Shawnee", "Sheffield Lake", "Shelby", "Sherrodsville",
					"Sherwood", "Shiloh", "Short Creek", "Shreve", "Sidney", "Sinking Spring",
					"Smithfield", "Smithville", "Solon", "Somerdale", "Somerset",
					"Somerville", "South Bloomingville", "South Charleston", "South Lebanon",
					"South Point", "South Salem", "South Solon", "South Vienna",
					"South Webster", "Southington", "Sparta", "Spencer", "Spencerville",
					"Spring Valley", "Springboro", "Springfield", "Stafford", "Sterling",
					"Steubenville", "Stewart", "Stillwater", "Stockdale", "Stockport",
					"Stone Creek", "Stony Ridge", "Stout", "Stoutsville", "Stow", "Strasburg",
					"Stratton", "Streetsboro", "Strongsville", "Struthers", "Stryker",
					"Sugar Grove", "Sugarcreek", "Sullivan", "Sulphur Springs", "Summerfield",
					"Summit Station", "Summitville", "Sunbury", "Swanton", "Sycamore",
					"Sycamore Valley", "Sylvania", "Syracuse", "Tallmadge", "Tarlton",
					"Terrace Park", "The Plains", "Thompson", "Thornville", "Thurman",
					"Thurston", "Tiffin", "Tiltonsville", "Tipp City", "Tippecanoe", "Tiro",
					"Toledo", "Tontogany", "Torch", "Toronto", "Tremont City", "Trenton",
					"Trimble", "Trinway", "Troy", "Tuppers Plains", "Tuscarawas", "Twinsburg",
					"Uhrichsville", "Union City", "Union Furnace", "Unionport", "Uniontown",
					"Unionville", "Unionville Center", "Uniopolis", "Upper Sandusky", "Urbana",
					"Utica", "Valley City", "Van Buren", "Van Wert", "Vandalia", "Vanlue",
					"Vaughnsville", "Venedocia", "Vermilion", "Verona", "Versailles",
					"Vickery", "Vienna", "Vincent", "Vinton", "Wadsworth", "Wakefield",
					"Wakeman", "Walbridge", "Waldo", "Walhonding", "Walnut Creek", "Wapakoneta",
					"Warnock", "Warren", "Warsaw", "Washington Court House",
					"Washingtonville", "Waterford", "Waterloo", "Watertown", "Waterville",
					"Wauseon", "Waverly", "Wayland", "Wayne", "Waynesburg", "Waynesfield",
					"Waynesville", "Wellington", "Wellston", "Wellsville", "West Alexandria",
					"West Chester", "West Elkton", "West Farmington", "West Jefferson",
					"West Lafayette", "West Liberty", "West Manchester", "West Mansfield",
					"West Millgrove", "West Milton", "West Point", "West Portsmouth",
					"West Rushville", "West Salem", "West Union", "West Unity", "Westerville",
					"Westfield Center", "Westlake", "Weston", "Westville", "Wharton",
					"Wheelersburg", "Whipple", "White Cottage", "Whitehouse", "Wickliffe",
					"Wilberforce", "Wilkesville", "Willard", "Williamsburg", "Williamsfield",
					"Williamsport", "Williamstown", "Williston", "Willoughby", "Willow Wood",
					"Willshire", "Wilmington", "Wilmot", "Winchester", "Windham", "Windsor",
					"Winesburg", "Wingett Run", "Winona", "Wolf Run", "Woodsfield",
					"Woodstock", "Woodville", "Wooster", "Wren", "Xenia", "Yellow Springs",
					"Yorkshire", "Yorkville", "Youngstown", "Zaleski", "Zanesfield", "Zanesville",
					"Zoar"
				],
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

		// LOAD ROUTE (homepage)
		this.get('/', function (context) {
			
			//rebuild clocks from cookie...
			
			CoolClock.findAndCreateClocks(); //create canvas for analog clocks.
			
		}); //end "get #/"
    
		
		this.put('#/put/format', function (context) {
				var time_format = this.param['format']; //either metric, or ampm
			$('.city-time .format.active').removeClass('active');
			$('.city-time .format .ampm').addClass('active');
			alert('setting 12/24 to');
			// !! TODO!
			// There are 2 things! the format, and the am and pm toggling, handle am-pm in time management
			
			
		}); //end format route
		
		
		
		
		/////ADD ROUTE
		this.post('#/post/q', function(context) {
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
								$(this).find('.hours').text(cityTime.getHours());
								var strMinutes = cityTime.getMinutes();

								if(strMinutes < 10){ strMinutes = '0'+strMinutes;	} //prepend a zero if 1 digit
								$(this).find('.minutes').text(strMinutes);
								$(this).find('.mili').text(cityTime.getTime());
								//todo: update Analog.
							});
							$('.clock').trigger('minuteChange');
							CoolClock.findAndCreateClocks();
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