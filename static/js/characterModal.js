let charPortraits = document.querySelectorAll(".charImg");
charPortraits.forEach(function(charPortrait){
	charPortrait.addEventListener('click', function(e){
		e.preventDefault();
		console.log("clicked " + charPortrait.getAttribute("data"));
		populateData(charPortrait.getAttribute("data"));
		renderModal(charPortrait.getAttribute("data"));
	});
});

let closeButton = document.querySelector("#closeButton");
closeButton.addEventListener('click', function(){
	closeModal();
});

//add check if we are in mobile mode?

function renderModal(character){
	let blur = document.querySelector(".globalBlur");
	blur.style.display = "block";
	blur.style.pointerEvents = "auto";
	
	let body = document.querySelector("body");
	body.style.overflow = "hidden";
	body.style.pointerEvents = "none";
}

function closeModal(){
	//hide the modal
	let blur = document.querySelector(".globalBlur");
	blur.style.display = "none";
	blur.style.pointerEvents = "auto";
	
	let body = document.querySelector("body");
	body.style.overflow = "auto";
	body.style.pointerEvents = "auto";
}

//populate with data
function populateData(charName){
	let charPortrait = document.querySelector("img.characterPortrait");
	charPortrait.setAttribute("src","./static/portraits/" + charName + ".png");
	
	//get banners they ran on
	let banners = [];
	bannerOverview.forEach(function(banner){
		banner.featuredCharacters.forEach(function(character){
			if(character === charName)
				banners.push(banner);
		});
	});
	
	currentVersion = bannerOverview[0].version;
	
	//calculate last time they ran (e.g. Eula last ran in v2.4)
	//calculate amount of runs
	let modalCharName = document.querySelector(".characterName");
	modalCharName.innerText = charName;
	
	let modalCharPatch = document.querySelector(".characterPatch");
	if(!(banners.length === 1 && currentVersion === banners[0].version)) //if the current patch is the character's only run
		modalCharPatch.innerText = "Last run: V" + (currentVersion === banners[0].version ? banners[1].version : banners[0].version) + " (x days ago)";
	else
		modalCharPatch.innerText = "This is their first run";
	
	let modalCharRuns = document.querySelector(".characterRuns");
	modalCharRuns.innerText = "Total amount of runs: " + banners.length; //check if the character is currently running; if so, -1.
	//Days since run?
	
	let existingBanner = document.querySelectorAll(".banner");
	if(existingBanner.length > 0){
		existingBanner.forEach(function(banner){
			banner.remove();
		});
	}
	
	let bannerList = document.querySelector(".bannerList");
	banners.forEach(function(banner){
		let key = banner.version.replace(/\./g,"_");
			
		let newBanner = document.createElement("div");
		newBanner.className = "banner";
		
		let newTitle = document.createElement("div");
		newTitle.className = "bannerTitle";
		newTitle.innerText = "V" + banner.version;
		newBanner.appendChild(newTitle);
		
		let featuredText = document.createElement("div");
		featuredText.style.marginBottom = "0.5em";
		featuredText.innerText = "Featured characters:";
		newBanner.appendChild(featuredText);
		
		let characterDeck = document.createElement("div");
		characterDeck.className = "characterDeck";
		banner.featuredCharacters.forEach(function(character){
			let characterDiv = document.createElement("div");
			characterDiv.className = "character"
			let characterPortrait = document.createElement("img");
			characterPortrait.className = character + "Img charImg modalCharImg";
			characterPortrait.setAttribute("src","./static/portraits/" + character + ".png");
			characterPortrait.setAttribute("alt", character + " stats");
			characterPortrait.setAttribute("title", character + " stats");
			characterPortrait.setAttribute("data", character + " stats");
			
			characterDiv.appendChild(characterPortrait);
			characterDeck.appendChild(characterDiv)
		});
		newBanner.appendChild(characterDeck);
		
		let center = document.createElement("center");
		center.style.width = "100%";
		
		let timeInfoDiv = document.createElement("div");
		timeInfoDiv.className = "timeInfo";
		let runTime = document.createElement("div");
		runTime.className = "timeInfoData";
		runTime.id = "runTime";
		runTime.innerHTML = "Banner duration:<br><span id='runTimeData'><date value=" + datesData[key].start + ">--</date> - <date value=" + datesData[key].end + ">--</date></span>"
		
		let daysSince = document.createElement("div");
		daysSince.className = "timeInfoData";
		daysSince.id = "daysSince";
		daysSince.innerHTML = "Days since banner ended:<br><span id='daysSinceData'>--</span>";
		
		let phase1 = document.createElement("div");
		phase1.className = "timeInfoData";
		phase1.id = "phase1";
		phase1.innerHTML = "Phase change Date:<br><span id='phase1Data'><date value=" + datesData[key].phase + "></date></span>"
		
		timeInfoDiv.appendChild(runTime);
		timeInfoDiv.appendChild(daysSince);
		timeInfoDiv.appendChild(phase1)
		center.appendChild(timeInfoDiv);
		
		newBanner.appendChild(center);
		
		bannerList.appendChild(newBanner);
		
		calculateTime();
		parseDates();
	});
}

