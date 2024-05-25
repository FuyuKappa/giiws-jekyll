let links = document.querySelectorAll("a");
links.forEach(function(link){
	link.innerHTML = link.innerHTML.replace("_",".")
	
	let end = link.querySelector("#runTimeData").textContent.split("- ")[1];
	if(end !== "??"){
		console.log("end is ??");
		let elapsedDays = Math.round( (Date.now() - Date.parse(end)) / (1000*3600*24));
		if(elapsedDays < 0){
			link.querySelector("#daysSince").innerHTML = link.querySelector("#daysSince")
														.innerHTML.replace("since banner ended","until banner ends");
			elapsedDays = elapsedDays * -1;
		}
		link.querySelector("#daysSinceData").innerHTML = elapsedDays;
	}
	else{
		let start = link.querySelector("#runTimeData").textContent.split("- ")[0];;
		link.querySelector("#daysSince").innerHTML = link.querySelector("#daysSince")
														.innerHTML.replace("since banner ended","until banner starts");
		link.querySelector("#daysSinceData").innerHTML =  Math.round( (Date.now() - Date.parse(start)) / (1000*3600*24)) * -1;
	}
	
	
	/*
	let numbers = link.innerHTML.split(".")
	if(numbers[0] == "V3"){
		link.style.color = "green";
	}
	else if(numbers[0] == "V4"){
		link.style.color = "blue";
	}
	*/
});