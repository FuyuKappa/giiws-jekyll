let currentOptions = {
	"Server": "Asia",
	"Local" : "False"
};

//initialize the UI
document.querySelectorAll('#server > option[value="' + currentOptions.Server + '"]').forEach(function(option){option.setAttribute("selected", true)});

let dateFormatter = new Intl.DateTimeFormat('en-US',{
	dateStyle:'long',
    timeStyle: 'short',
    timeZone: 'Asia/Shanghai'
});

//attach event listeners to options setters

//Times from the lookup table are in UTC
function parseDates(){
	let dates = document.querySelectorAll("date");

	dates.forEach(function(date){
		try{
			let timeStamp = parseInt(date.getAttribute("value"));
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

setInterval(() => calculateTime(), 1000);
