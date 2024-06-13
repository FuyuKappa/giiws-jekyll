let currentOptions = {
	"Server": "Asia",
	"Local" : false
};
//set default currentOptions to locale offset

//initialize the UI
function renderTimeUI(){
	document.querySelectorAll("#server > option").forEach(function(option){option.selected = false});
	document.querySelectorAll('#server > option[value="' + currentOptions.Server + '"]').forEach(function(option){option.selected = true});
	currentOptions.Local === true ? locals.forEach(function(local){local.checked = true}) : locals.forEach(function(local){local.checked = false});
}

let dateFormatter;
setDateFormat();
function setDateFormat(){
	let server = currentOptions.Server;
	let timeZoneOffset;
	if(server === "Asia"){
		timeZoneOffset = "+08" 
	}
	else if(server === "Europe"){
		timeZoneOffset = "+00" 
	}
	else if(server === "America"){
		timeZoneOffset = "America/New_York" 
	}
	dateFormatter = new Intl.DateTimeFormat('en-US',{
		dateStyle:'long',
		timeStyle: 'short',
		timeZone: timeZoneOffset
	});
	parseDates();
}

//attach event listeners to options setters
let locals = document.querySelectorAll("#local");
locals.forEach(function(local){
	local.addEventListener('click', function(){
		currentOptions.Local = local.checked;
		renderTimeUI();
	});
});
let servers = document.querySelectorAll("#server");
servers.forEach(function(server){
	server.addEventListener('change', function(){
		currentOptions.Server = server.value;
		renderTimeUI();
		setDateFormat();
	});
});

//Times from the lookup table are in UTC
function parseDates(){
	let dates = document.querySelectorAll("date");

	dates.forEach(function(date){
		try{
			let timeStamp = parseInt(date.getAttribute("value"));
			
			if(date.className === "phaseDate" && currentOptions.Server === "America"){
				timeStamp = timeStamp + 46800;  //13 hours offset for america server???
			}
				
			let dateTime = new Date(timeStamp);
			date.innerText = dateFormatter.format(dateTime);
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
		
		if(end === "??" && phase === "??"){//if end doesn't exist, and neither does phase change, then calculate time to banner start
			//change the text to "Time until banner starts"
			time.querySelector("#daysSince").innerHTML = time.querySelector("#daysSince")
				.innerHTML.replace("since banner ended","until banner starts");
			//get start
			//calculate in countdown
		}
		else if(end === "??"){ //if end doesn't exist, then calculate time to phase change
			//change the text to "Time until next banner"
			time.querySelector("#daysSince").innerHTML = time.querySelector("#daysSince")
			    .innerHTML.replace("Days since banner ended","Time until next phase");
			//get phase change
			//calculate in countdown
			if(currentOptions.Server === "America"){
				phase = parseInt(phase) + 46800000;
			}
			let [days, hours, minutes, seconds] = updateCountdown(phase, UTCNow);
			time.querySelector("#daysSinceData").innerHTML = days +  " days " + hours + " hours " + minutes + " minutes and " + seconds + " seconds";
		}
		else if(end !== "??" && parseInt(end) >= UTCNow){
		//end exists and we're below it, calculate time to end
			time.querySelector("#daysSince").innerHTML = time.querySelector("#daysSince")
				.innerHTML.replace("Days since banner ended","Time until version ends");
			//get end
			//calculate in countdown
			
		}
		else if(end !== "??" && parseInt(end) < UTCNow){
			//end exists and we're beyond it, calculate time since end
			//get end
			let elapsedDays = Math.round((UTCNow - parseInt(end)) / (1000*3600*24));
			//get only days since
			time.querySelector("#daysSinceData").innerHTML = elapsedDays;
		}

	/*
		if(end !== "??"){
			//let elapsedDays = Math.round( (Date.now() - Date.parse(end)) / (1000*3600*24));
			let elapsedDays = (Date.now() - Date.parse(end)) / (1000*3600*24);
			//console.log(elapsedDays);
			if(elapsedDays < 1){
				time.querySelector("#daysSince").innerHTML = time.querySelector("#daysSince")
															.innerHTML.replace("since banner ended","until banner ends");
				if(elapsedDays < 0)
					elapsedDays = elapsedDays * -1;
				else
					elapsedDays = 0;
			}
			elapsedDays = Math.round(elapsedDays);
			time.querySelector("#daysSinceData").innerHTML = elapsedDays;
		}
		else{
			console.log("here");
			let start = time.querySelector("#runTimeData").textContent.split("- ")[0];;
			time.querySelector("#daysSince").innerHTML = time.querySelector("#daysSince")
															.innerHTML.replace("since banner ended","until banner starts");
			time.querySelector("#daysSinceData").innerHTML =  Math.round( (Date.now() - Date.parse(start)) / (1000*3600*24)) * -1;
		}*/
		
		
		/*
		let numbers = time.innerHTML.split(".")
		if(numbers[0] == "V3"){
			time.style.color = "green";
		}
		else if(numbers[0] == "V4"){
			time.style.color = "blue";
		}
		*/
	});
};

function updateCountdown(target, from){
	if (typeof target == "string")
		target = parseInt(target);0
	
	let diffInSec = Math.floor((target - from) / 1000);
	let days = Math.floor(diffInSec / 86400)
	let hours = Math.floor((diffInSec % 86400) / 3600);
	let minutes = Math.floor((diffInSec % 3600) / 60) - 1;
	let seconds = Math.floor(diffInSec % 60);
	
	return [days, hours, minutes, seconds];
}

calculateTime();
parseDates();
renderTimeUI();

setInterval(() => calculateTime(), 1000);
