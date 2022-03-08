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
        if(json.length == 0) {
          console.log('no nearby properties');
          let li = document.createElement('li');
          li.innerHTML = 'no nearby properties!';
          coords.appendChild(li);
        }
        else {
          console.log('nearby properties');
          for(const each of json){
            let li = document.createElement('li');
            let ul = document.createElement('ul');
            // let liExemptTot = document.createElement('li');
            let liX = document.createElement('li');
            let liY = document.createElement('li');
            li.innerHTML = 'address: ' + each.address;
            // liExemptTot.innerHTML = 'tax-exempt total: ' + each.exempttot; 
            liX.innerHTML = 'x coord: ' + each.st_x;
            liY.innerHTML = 'y coord: ' + each.st_y;
            coords.appendChild(li);
            li.appendChild(ul);
            // ul.appendChild(liExemptTot);
            ul.appendChild(liX);
            ul.appendChild(liY);
          }
        }
          //in here I need to make sure the json is getting printed to the html element
          // coords.innerHTML = json[0].address;
        
        console.log('finished');
      });
  }
  
  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }
  
  navigator.geolocation.getCurrentPosition(success, error, [options]);