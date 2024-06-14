let links = document.querySelectorAll("a");

links.forEach(function(link){
	link.innerHTML = link.innerHTML.replace("_",".");
});

/*
	let numbers = link.innerHTML.split(".")
	if(numbers[0] == "V3"){
		link.style.color = "green";
	}
	else if(numbers[0] == "V4"){
		link.style.color = "blue";
	}
	
});

*/