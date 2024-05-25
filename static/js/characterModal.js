
let charPortraits = document.querySelectorAll(".charImg");
charPortraits.forEach(function(charPortrait){
	charPortrait.addEventListener('click', function(e){
		e.preventDefault();
		console.log("clicked " + charPortrait.getAttribute("data"));
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
	body.style.overflow = "block";
	body.style.pointerEvents = "auto";
}

//populate with data
function populateData(){
	//get the name of character being looked at
	//get banners they ran on
	//calculate last time they ran (e.g. Eula last ran in v2.4)
	//calculate amount of runs
	//
}

