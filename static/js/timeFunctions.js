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
let dates = document.querySelectorAll("date");

dates.forEach(function(date){
	try{
		let timeStamp = parseInt(date.getAttribute("value"));
		let dateTime = new Date(timeStamp);
		date.innerText = dateFormatter.format(dateTime);
		date.innerText = date.innerText.replace(/at/g,"");
	}catch{}
});