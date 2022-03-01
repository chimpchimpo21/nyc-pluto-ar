var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };
  
  const coords = document.getElementById('status'); 
  
  function success(pos) {
    var crd = pos.coords;
    var long = crd.longitude;
    var lat = crd.latitude;
    console.log(long, lat);
    fetch(`https://powerful-woodland-32319.herokuapp.com/db?long=${long}&lat=${lat}`)
      .then(response => response.json())
      .then(json => {
        console.log(json);
        //If there are no json objects currently, then simply display that on the page
        if(!Object.keys(json)){
          let li = document.createElement('li');
          li.innerHTML = "No nearby properties!";
          coords.appendChild(li);
        }
        else {
          //in here I need to make sure the json is getting printed to the html element
          // coords.innerHTML = json[0].address;
          for(const each of json){
            let li = document.createElement('li');
            li.innerHTML = each.address;
            coords.appendChild(li);
          }
        }
        console.log('finished');
      });
  }
  
  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }
  
  navigator.geolocation.getCurrentPosition(success, error, [options]);