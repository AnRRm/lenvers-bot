const express = require('express');
const bodyParser = require('body-parser');
const dbMenu = require('./menu.json');

const app = express();
app.use(bodyParser.json());

// Load routes by using express utility
app.post('/weather',				getWeather);
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

function getWeather(req, res) {
	
	const location = req.body.conversation.memory.location;
	const datetime = req.body.conversation.memory.datetime;
	const weather = require('openweathermap-js');

	weather.defaults({
        appid: process.env.OPENWMAP_ID,
        method: 'name',
        mode: 'json',
        units: 'metric',
        lang: 'fr',
     });
	 
	const location_ = location.raw;
	var d = new Date(datetime.iso);
	var timeStamp = d.getTime()/1000;

	weather.forecast({
        location: location_,
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
		res.json({
		replies: [
		{ type: 'text', content: 'Désolé Je n\'arrive pas vous indiquer la météo à ' + location.raw + ' le ' + datetime.raw}
		],
		});
	}
	else
	{
		res.json({
			replies: [
						{ type: 'picture', content: getweatherpicture(weatherHolder.weather[0].description ) },
						{ type: 'text', content: 'La météo ' + datetime.raw + ' à ' + location.raw + ':' },  
						{ type: 'text', content: weatherHolder.weather[0].description + ', ' + parseInt(weatherHolder.main.temp) + '°C'  },        
					],
				});
	}		
    } 
	else
	{
		res.json({
		replies: [
					{ type: 'text', content: `Je n'arrive pas vous indiquer la meteo a ${location.raw} le ${datetime.iso}` }
				],
		});
	}
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