const express = require('express');
const bodyParser = require('body-parser');
const dbMenu = require('./menu.json');
const dbProgram = require('./program.json');

const app = express();
app.use(bodyParser.json());

// Load routes by using express utility
app.post('/greetings', 				getGreetingReply);
app.post('/goodbye', 				getGoodbyeReply);
app.post('/beer', 					getBeerMenu);
app.post('/wine', 					getWineMenu);
app.post('/cocktail', 				getCocktailMenu);
app.post('/mojito', 				getMojitoMenu);
app.post('/planches', 				getPlanchesMenu);
app.post('/bagels', 				getBagelsMenu);
app.post('/tacos', 					getTacosMenu);
app.post('/taquitos', 				getTaquitosMenu);
app.post('/plates', 				getPlatesMenu);
app.post('/program', 				getProgram);
app.post('/weekprogram', 			getWeekProgram);


app.post('/errors', function (req, res) { 
  console.error(req.body);
  res.sendStatus(200);
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` :) App is listening on port ${PORT}`));


// this function must be moved to utils
function getweatherpicture(description)
{
	ret = '';
	switch(description) {
    case 'légère pluie':
        ret = 'http://icons.iconarchive.com/icons/oxygen-icons.org/oxygen/128/Status-weather-showers-scattered-day-icon.png';
        break;
    case 'peu nuageux':
        ret = 'http://icons.iconarchive.com/icons/oxygen-icons.org/oxygen/128/Status-weather-clouds-icon.png';
        break;
	case 'partiellement nuageux':
	    ret = 'http://icons.iconarchive.com/icons/oxygen-icons.org/oxygen/128/Status-weather-clouds-icon.png';
        break;
	case 'ciel dégagé':
        ret = 'http://icons.iconarchive.com/icons/oxygen-icons.org/oxygen/128/Status-weather-clear-icon.png';
        break;
	case 'nuageux':
        ret = 'http://icons.iconarchive.com/icons/oxygen-icons.org/oxygen/128/Status-weather-many-clouds-icon.png';
        break;
	case 'pluie modérée':
        ret = 'http://icons.iconarchive.com/icons/oxygen-icons.org/oxygen/128/Status-weather-showers-icon.png';
        break;
    default:
        ret = 'http://icons.iconarchive.com/icons/icons8/ios7/128/Weather-Partly-Cloudy-Rain-icon.png';
	} 
	return ret;
}

function getProgram(req, res) {
	
	var replies = [];
	const datetime = req.body.conversation.memory.datetime;
	var d = new Date(datetime.iso);
	const weather = require('openweathermap-js');
		weather.defaults({
        appid: '681f922539f01fc8d6bd4cd04de6c94a',
        method: 'name',
        mode: 'json',
        units: 'metric',
        lang: 'fr',
     });
	
	var programHolder = null;
	programHolder  = dbProgram.filter(function(item) {
		return (item.date == d.getDate() && item.month == (d.getMonth() + 1));
	});
	
	if(programHolder !=  null)
	{

		replies.push({ type: 'text', content: 'L\'envers vous propose le ' + d.getDate()+ '/'  + (d.getMonth() + 1) + ' prochain un(e) ' + programHolder[0].event + ' ' + programHolder[0].type + ' animé(e) par ' + 		
		programHolder[0].artist + ' à partir de ' + programHolder[0].start +  '  🙂 '  });
		d = new Date(2018,d.getMonth(),d.getDate(),22);
		var timeStamp = d.getTime()/1000;
		weather.forecast({
			location: 'Marrakech',
			language: 'fr'
		}, function(err, data) {
		if (!err) 
		{									
			// on OK
			var weatherHolder = null;
			if(data.list != undefined)
				weatherHolder = data.list.find(p => (Math.abs(parseInt(p.dt)-parseInt(timeStamp)) < 5400 ));	
					
				if (!weatherHolder) 
				{
					res.json({replies: replies});		
				}
				else
				{
					console.log(weatherHolder);
					replies.push({ type: 'text', content: 'Toc Toc petite info ;), la météo ce soir là serait: ' + weatherHolder.weather[0].description + ', ' + parseInt(weatherHolder.main.temp) + '°C'});
					res.json({replies: replies});
				}
                 			
		} 
		else
		{
			
		res.json({replies: replies});
		}
		
	});	
	}
	else
	{	
		replies.push({ type: 'text', content: 'un probleme s\'est produit lors de l\'extraction de l\'evenement demandé...désolé!'});
		res.json({replies: replies});
		
	}
	
	
}

function getGreetingReply(req, res) {
	
	var userName = req.body.conversation.participant_data.userName;
	res.json({
	replies: 
	[
		{ type: 'text', content: 'Bonjour ' + getFirstName(userName) + '  🙂 '  }
	],
	});
}

function getGoodbyeReply(req, res) 
{
	var userName = req.body.conversation.participant_data.userName;
	res.json({
	replies: 
	[
		{ type: 'text', content: 'À bientôt ' + getFirstName(userName) + '!' }
	],
	});	
}

function getMojitoMenu(req, res) {
	
	var products = findProductByType("mojito");
	const replies = [];
	if(products == null)
	{
		replies.push({ type: 'text', content: 'Oups je ne sais pas vous répondre :s'});	
	}
	else
	{
		for (var index = 0; index < products.length; index++) 
		{
			replies.push({ type: 'text', content: products[index].name + ' - ' +  products[index].price + ' Dhs' });
		}
	}
	
	res.json({replies: replies});
}


function getCocktailMenu(req, res) {
	
	var products = findProductByType("cocktail");
	const replies = [];
	if(products == null)
	{
		replies.push({ type: 'text', content: 'Oups je ne sais pas vous répondre :s'});
	}
	else
	{
		for (var index = 0; index < products.length; index++) 
		{
			replies.push({ type: 'text', content: products[index].name + ' - ' +  products[index].price + ' Dhs' });
		}
	}
	
	res.json({replies: replies});
}

function getWineMenu(req, res) {
	
	var products = findProductByType("wine");
	const replies = [];
	if(products == null)
	{
		replies.push({ type: 'text', content: 'Oups je ne sais pas vous répondre :s'});
	}
	else
	{
		for (var index = 0; index < products.length; index++) 
		{
			replies.push({ type: 'text', content: products[index].name + ' - ' +  products[index].price + ' Dhs' });
		}
	}
	
	res.json({replies: replies});
}

function getBeerMenu(req, res) {
	
	var products = findProductByType("beer");
	const replies = [];
	if(products == null)
	{
		replies.push({ type: 'text', content: 'Oups je ne sais pas vous répondre :s'});	
	}
	else
	{
		for (var index = 0; index < products.length; index++) 
		{
			replies.push({ type: 'text', content: products[index].name + ' - ' +  products[index].price + ' Dhs' });
		}
	}
	
	res.json({replies: replies});
	
}

function getPlanchesMenu(req, res) {
	
	var products = findProductByType("planche");
	const replies = [];
	if(products == null)
	{
		replies.push({ type: 'text', content: 'Oups je ne sais pas vous répondre :s'});
	}
	else
	{
		for (var index = 0; index < products.length; index++) 
		{
			replies.push({ type: 'text', content: products[index].name + ' - ' +  products[index].price + ' Dhs' });
		}
	}
	
	res.json({replies: replies});
	
}

function getBagelsMenu(req, res) {
	
	var products = findProductByType("bagel");
	const replies = [];
	if(products == null)
	{
		replies.push({ type: 'text', content: 'Oups je ne sais pas vous répondre :s'});
	}
	else
	{
		for (var index = 0; index < products.length; index++) 
		{
			replies.push({ type: 'text', content: products[index].name + ' - ' +  products[index].price + ' Dhs' });
		}
	}
	
	res.json({replies: replies});
	
}

function getTacosMenu(req, res) {
	
	var products = findProductByType("tacos");
	const replies = [];
	if(products == null)
	{
		replies.push({ type: 'text', content: 'Oups je ne sais pas vous répondre :s'});
	}
	else
	{
		for (var index = 0; index < products.length; index++) 
		{
			replies.push({ type: 'text', content: products[index].name + ' - ' +  products[index].price + ' Dhs' });
		}
	}
	
	res.json({replies: replies});
	
}

function getTaquitosMenu(req, res) {
	
	var products = findProductByType("taquitos");
	const replies = [];
	if(products == null)
	{
		replies.push({ type: 'text', content: 'Oups je ne sais pas vous répondre :s'});
	}
	else
	{
		for (var index = 0; index < products.length; index++) 
		{
			replies.push({ type: 'text', content: products[index].name + ' - ' +  products[index].price + ' Dhs' });
		}
	}
	
	res.json({replies: replies});
	
}


function getPlatesMenu(req, res) {
	
	var products = findProductByType("plate");
	const replies = [];
	if(products == null)
	{
		replies.push({ type: 'text', content: 'Oups je ne sais pas vous répondre :s'});
	}
	else
	{
		for (var index = 0; index < products.length; index++) 
		{
			replies.push({ type: 'text', content: products[index].name + ' - ' +  products[index].price + ' Dhs' });
		}
	}
	
	res.json({replies: replies});
	
}


function getWeekProgram(req, res) {
	
	
	const replies = [];
	var programHolder = null;
	const currentDate = new Date();
	programHolder  = dbProgram.filter(function(item) {
		return (item.date == currentDate.getDate() && item.month == (currentDate.getMonth() + 1));
	});
	if(programHolder !=  null)
	{
		console.log(programHolder);
		replies.push({ type: 'text', content: 'Aujourd\'hui'});
		replies.push({ type: 'text', content: 'un(e)' + programHolder[0].event + ' ' + programHolder[0].type + ' animée par ' + programHolder[0].artist + ' à partir de ' + programHolder[0].start});
		for(var index = programHolder[0].id + 1  ; index < (programHolder[0].id + 8);index ++)
		{
			var NextProgramHolder = null;
			NextProgramHolder  = dbProgram.filter(function(item) {
				return (item.id == index);
			});
			if(NextProgramHolder != undefined)
			{
				replies.push({ type: 'text', content: 'Le ' + NextProgramHolder[0].date + '  /' + NextProgramHolder[0].month});
		        replies.push({ type: 'text', content: 'un(e)' + NextProgramHolder[0].event + ' ' + NextProgramHolder[0].type + ' animée par ' + NextProgramHolder[0].artist + ' à partir de ' + NextProgramHolder[0].start});
			}
		}
	}
	res.json({replies: replies});
	
}




function findProductByType(type) {
  var data = dbMenu.filter(function(item) {
  return item.type == type;
});
  if (!data) {
    return null;
  }
  return data;
};


// TODO this function must be moved to Utils
function capitalizeFirstLetter(string) 
{
	return string.charAt(0).toUpperCase() + string.slice(1);
}


function getFirstName(string)
{
	var parts = string.split(" ");
	var ret = "";
	for (var i=0; i< parts.length; i++)
	{
		if(i < parts.length - 1)
		{
			ret += parts[i];
		}
	}
	return ret;
}