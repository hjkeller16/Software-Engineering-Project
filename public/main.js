window.onload = intialize;

async function intialize() {
  const token = localStorage.getItem('token');
  let payload;
  let isValid = true;
  try {
    const response = await fetch('/auth/payload', {
      headers: {
        'Authorization': 'Bearer ' + token,
      }
    });
    payload = (await response.json()).payload;
  } catch (err) {
    isValid = false;
  }

  if (!token || !isValid || !payload) {
    document.getElementById('login-container').style.display = 'block';
    document.getElementById('content-container').style.display = 'none';
  } else {
    document.getElementById('greeting').innerHTML = `Hello ${payload.username}`;
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('content-container').style.display = 'block';
  }
}

async function onFormPress(method) {
  try {
    const credentials = {
      username: document.getElementById('login-form').username.value,
      password: document.getElementById('login-form').password.value
    }

    const response = await fetch('/auth/' + method, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });

    const responseObject = await response.json();
    if (responseObject.token) {
      localStorage.setItem('token', responseObject.token);
    }
    else {
      window.alert(responseObject.error);
    }
  } catch (err) {
    window.alert(method + ' failed');
  }
  intialize();
}

function onLogoutPress() {
  localStorage.clear();
  intialize();
}