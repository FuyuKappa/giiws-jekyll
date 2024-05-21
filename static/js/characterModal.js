let charPortraits = document.querySelectorAll(".charImg");
charPortraits.forEach(function(charPortrait){
	charPortrait.addEventListener('click', function(e){
		e.preventDefault();
		console.log("clicked "+ charPortrait.getAttribute("alt"));
	});
});

//add check if we are in mobile mode