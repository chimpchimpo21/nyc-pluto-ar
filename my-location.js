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
    // console.log(crd.longitude, crd.latitude);
    fetch(`https://powerful-woodland-32319.herokuapp.com/?long=${long}&lat=${lat}`)
      .then(response => response.json())
      .then(json => {
        console.log(json);
        //in here I need to make sure the json is getting printed to the html element
        // coords.innerHTML = json[0].address;
        for(const each of json){
          let li = document.createElement('li');
          li.innerHTML = each.address;
          coords.appendChild(li);
        }
        console.log('finished');
      });
  }
  
  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }
  
  navigator.geolocation.getCurrentPosition(success, error, [options]);