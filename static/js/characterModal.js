
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
			if(character === charName){
				banners.push(banner);
			}
		});
	});	
	//calculate last time they ran (e.g. Eula last ran in v2.4)
	//calculate amount of runs
	let modalCharName = document.querySelector(".characterName");
	modalCharName.innerText = charName;
	
	let modalCharPatch = document.querySelector(".characterPatch");
	modalCharPatch.innerText = "V" + banners[0].version; //get max?
	
	let modalCharRuns = document.querySelector(".characterRuns");
	modalCharRuns.innerText = banners.length; //check if the character is currently running; if so, -1.
	//Days since run?
	
	let existingBanner = document.querySelectorAll(".banner");
	if(existingBanner.length > 0){
		existingBanner.forEach(function(banner){
			banner.remove();
		});
	}
	
	let bannerList = document.querySelector(".bannerList");
	banners.forEach(function(banner){
		let newBanner = document.createElement("div");
		newBanner.className = "banner";
		newBanner.innerText = banner.version;
		bannerList.appendChild(newBanner);
	});
}

