window.onload = async() => {
    document.getElementById('start').innerHTML = 'Frontend is running';
    button = document.getElementById('button');
    button.onclick = async() => {
        const infoResponse = await fetch('/GetInfo');
        if (infoResponse.status >= 400) {
          throw new Error(`Could not get an information (${await infoResponse.text()})`);
        }
        text = (await infoResponse.json()).info;
        document.getElementById('info').innerHTML = text;
    }
  }