window.onload = () => {
    document.getElementById('start').innerHTML = 'Frontend is running';
    button = document.getElementById('button');
    button.onclick = () => {
      const infoText = new Promise(function (resolve) {
        let text = fetch('/GetInfo');
        resolve(text)
      }).then((text)  => {
        document.getElementById('info').innerHTML = infoText.info;  
      }) 
    }
  }