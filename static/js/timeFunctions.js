let currentOptions;/* = {
	"Server": "Asia",
	"Local" : false,
	"timeZoneOffset": ""
};*/
//set default currentOptions to locale offset
let preferences = localStorage.getItem("time_pref");
if(preferences === null || preferences === "undefined")
	 currentOptions = {
		"Server": "Asia",
		"Local" : false,
		"timeZoneOffset": ""
	};
else
	currentOptions = JSON.parse(preferences);

function savePreferences(){
	localStorage.setItem("time_pref", JSON.stringify(currentOptions));
};

//initialize the UI
function renderTimeUI(){
	document.querySelectorAll("#server > option").forEach(function(option){option.selected = false});
	document.querySelectorAll('#server > option[value="' + currentOptions.Server + '"]').forEach(function(option){option.selected = true});
	currentOptions.Local === true ? locals.forEach(function(local){local.checked = true}) : locals.forEach(function(local){local.checked = false});
}

let specialTimeZones = {
	"-9.5": "Pacific/Marquesas",
	"-3.5": "America/St_Johns",
	"-2.5": "America/St_Johns",
	"+3.5": "Asia/Tehran",
	"+4.5": "Asia/Kabul",
	"+5.5": "Asia/Colombo",
	"+6.5": "Asia/Yangon",
	"+5.5": "Asia/Colombo",
	"+9.5": "Australia/Adelaide",
	"+10.5": "Australia/Adelaide"	
};

let dateFormatter;
function setDateFormat(){
	let server = currentOptions.Server;
	let timeZoneOffset;
	
	//if local = true, then set offset to whatever we have
	if(currentOptions.Local === true)
		currentOptions.timeZoneOffset = getTimeZoneOffsetInHours();
	else if(server === "Asia")
		currentOptions.timeZoneOffset = "+08"; 
	else if(server === "Europe")
		currentOptions.timeZoneOffset = "+01" 
	else if(server === "America")
		currentOptions.timeZoneOffset = "-05" 
	
	dateFormatter = new Intl.DateTimeFormat('en-US',{
		dateStyle:'long',
		timeStyle: 'short',
		timeZone: hoursOffsetToGMTOffset(currentOptions.timeZoneOffset)
	});
	parseDates();
}

function overrideFormatter(offsetInMinutes){
	currentOptions.timeZoneOffset = getTimeZoneOffsetInHours(offsetInMinutes);
	dateFormatter = new Intl.DateTimeFormat('en-US',{
		dateStyle:'long',
		timeStyle: 'short',
		timeZone: hoursOffsetToGMTOffset(currentOptions.timeZoneOffset)
	});
	parseDates();
	return currentOptions.timeZoneOffset, dateFormatter.resolvedOptions();
}

function getTimeZoneOffsetInHours(offsetInMinutes = new Date().getTimezoneOffset()){
	let diff = offsetInMinutes / -60;
	diff > 0 ? diff = "+0" + diff : diff = "-0" + diff.toString().replace(/-/g,"");
	return diff;
}

function cleanOffset(string){
	return string = string.replace(/0/g, "");
}

function hoursOffsetToGMTOffset(offset){
	offset = offset.replace(/([\+|-])0(\d)+/g, "$1$2");
	if(offset.indexOf(".") !== -1)
		return specialTimeZones[offset];
	else if(offset[0] === "+")
		return "Etc/GMT" + offset.replace(/\+/g, "-");
	else
		return "Etc/GMT" + offset.replace(/-/g, "+");
}

//attach event listeners to options setters
let locals = document.querySelectorAll("#local");
locals.forEach(function(local){
	local.addEventListener('click', function(){
		currentOptions.Local = local.checked;
		setDateFormat();
		renderTimeUI();
		savePreferences()
	});
});
let servers = document.querySelectorAll("#server");
servers.forEach(function(server){
	server.addEventListener('change', function(){
		currentOptions.Server = server.value;
		renderTimeUI();
		setDateFormat();
		calculateTime();
		savePreferences()
	});
});

//Times from the lookup table are in UTC
function parseDates(){
	let dates = document.querySelectorAll("date");

	dates.forEach(function(date){
		try{
			let timeStamp = parseInt(date.getAttribute("value"));
			
			if((date.className === "phaseDate" || date.className === "endDate") && currentOptions.Server === "America")
				timeStamp = timeStamp + 46800000;  //+13 hours offset for america server???
			else if((date.className === "phaseDate" || date.className === "endDate") && currentOptions.Server === "Europe")
				timeStamp = timeStamp + 25200000;  //+7 hours offset for Europe???

			let dateTime = new Date(timeStamp);
			date.innerText = dateFormatter.format(dateTime) + " (UTC" + cleanOffset(currentOptions.timeZoneOffset) + ")";
			date.innerText = date.innerText.replace(/at/g,"");
		}catch{}
	});
}

function calculateTime(){
	let UTCNow = Date.parse(new Date());
	
	let times = document.querySelectorAll(".timeInfo");
	times.forEach(function(time){
		let [start, end] = time.querySelectorAll("#runTime > #runTimeData > date");
		let phase = time.querySelector("#phase1 > #phase1Data > date").getAttribute("value");
		end = end.getAttribute("value"); //still a string
		start = start.getAttribute("value");
		let dataString = "<br><span id='daysSinceData'></span>"
		
		//console.log(end);
		if(currentOptions.Server === "America"){
			if(phase !== "??") phase = parseInt(phase) + 46800000;  //+13 hours offset for america server???
			if(end !== "??") end = parseInt(end) + 46800000;
		}
		else if(currentOptions.Server === "Europe"){
			if(phase !== "??") phase = parseInt(phase) + 25200000;  //+7 hours offset for Europe???
			if(end !== "??") end = parseInt(end) + 25200000;
		}
		
		if(end === "??" && phase === "??" && UTCNow < start){//if end doesn't exist, and neither does phase change, then calculate time to banner start
			//change the text to "Time until banner starts"
			time.querySelector("#daysSince").innerHTML = "Time until banner starts:" + dataString;
			//get start
			//calculate in countdown
			let [days, hours, minutes, seconds] = updateCountdown(start, UTCNow);
			time.querySelector("#daysSinceData").innerHTML = formatCountdown(days, hours, minutes, seconds);
		}
		else if(end === "??" && phase === "??" && UTCNow > start){//if end doesn't exist, and neither does phase change, but we're above start
			//change the text to "Time until banner starts"
			time.querySelector("#daysSince").innerHTML = "Time until next phase:" + dataString;
			//get start
			//calculate in countdown
			time.querySelector("#daysSinceData").innerHTML = "TBA";
		}
		else if((end === "??" && UTCNow < phase && UTCNow < start) || (end !== "??" && parseInt(end) >= UTCNow && UTCNow < phase && UTCNow < start)){
			//end doesn't exist OR it does and we're below phase and start
			time.querySelector("#daysSince").innerHTML = "Time until banner starts:" + dataString;
			let [days, hours, minutes, seconds] = updateCountdown(start, UTCNow);
			time.querySelector("#daysSinceData").innerHTML = formatCountdown(days, hours, minutes, seconds);
			console.log(UTCNow > start);
		}
		else if((end === "??" && UTCNow < phase && UTCNow > start)  || (end !== "??" && parseInt(end) >= UTCNow && UTCNow < phase && UTCNow > start)){ 
			//if end doesn't exist, then calculate time to phase change OR if it does and we're still below phase change and above start
			//change the text to "Time until next banner"
			time.querySelector("#daysSince").innerHTML = "Time until next phase:" + dataString;
			//get phase change
			//calculate in countdown
			if(phase !== "??"){
				let [days, hours, minutes, seconds] = updateCountdown(phase, UTCNow);
				time.querySelector("#daysSinceData").innerHTML = formatCountdown(days, hours, minutes, seconds);
			}
			else{
				time.querySelector("#daysSinceData").innerHTML = "TBA";
			}
		}
		else if(end !== "??" && parseInt(end) >= UTCNow){
			//end exists and we're below it but we're beyond phase change, calculate time to end 
			time.querySelector("#daysSince").innerHTML = "Time until version ends:" + dataString;
			//get end
			//calculate in countdown
			let [days, hours, minutes, seconds] = updateCountdown(end, UTCNow, false);
			time.querySelector("#daysSinceData").innerHTML = formatCountdown(days, hours, minutes, seconds);
		}
		else if(end !== "??" && parseInt(end) < UTCNow){
			//end exists and we're beyond it, calculate days since end
			time.querySelector("#daysSince").innerHTML = "Days since banner ended:" + dataString;
			//get end
			let elapsedDays = Math.round((UTCNow - parseInt(end)) / (1000*3600*24));
			//get only days since
			time.querySelector("#daysSinceData").innerHTML = elapsedDays;
		}
	});
};

function updateCountdown(target, from, toOffset = true){
	if (typeof target == "string")
		target = parseInt(target);
	
	let diffInSec = Math.floor((target - from) / 1000);
	let days = Math.floor(diffInSec / 86400)
	let hours = Math.floor((diffInSec % 86400) / 3600);
	let minutes = Math.floor((diffInSec % 3600) / 60) + (toOffset? -1: 1);
	let seconds = Math.floor(diffInSec % 60);
	
	return [days, hours, minutes, seconds];
}

function formatCountdown(days, hours, minutes, seconds){
	let output = "";
	if(days > 0) output += days + ( days===1 ? " day " : " days ");
	if(hours > 0) output += hours + ( hours===1 ? " hour ": " hours " );
	if(minutes > 0) output += minutes + ( minutes===1 ? " minute " : " minutes ");
	output += seconds + " seconds"
	return output.trim();
}

setDateFormat();
calculateTime();
parseDates();
renderTimeUI();

//Put local offset in the local option label
document.querySelectorAll("label[for='local']")
		.forEach(function(label){
			label.innerText = label.innerText + "(UTC"+ cleanOffset(getTimeZoneOffsetInHours()) + ")";
		});
		
//update the countdown timer every second
setInterval(() => calculateTime(), 1000);
