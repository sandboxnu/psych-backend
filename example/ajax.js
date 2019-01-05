// send file with string data and given filename to an API endpoint.
// 'experiment' endpoint for config, 'data' endpoint for collected data.
function uploadFile(endpoint, data, filename) {
  // Turn the string into a file.
  const file = new File([data], filename);

  const formData = new FormData();
  formData.append('file', file);

  // Using axios http lib to send post request with formdata.
  // fetch, xmlhttprequest, jquery etc. could also be used.
  axios.post(`http://localhost:3001/${endpoint}`, formData)
    .then(response => console.log(response))
    .catch(error => console.log(error));
}

function getCurrentConfig() {
  // using the native fetch api this time.
  //  do note that fetch might need to be polyfilled
  //  axios is probably better
  fetch('http://localhost:3001/experiment')
    .then(response => response.text())
    .then((text) => {
      document.getElementById('current-config').innerHTML = text;
    });
}

getCurrentConfig();


// Sample upload functions:

function uploadJSONConfig() {
  // Upload a sample json config
  const configObj = {
    videoId: '302719494',
    questions: [
      {
        type: 'mc',
        id: '1',
        label: 'What do you think?',
        choices: ['yes', 'no', 'nahhh b'],
      },
      {
        type: 'open',
        id: '2',
        label: 'other words',
      },
    ],
  };

  const jsonString = JSON.stringify(configObj);
  uploadFile('experiment', jsonString, 'config.txt');
}

function uploadCSVData() {
  // upload a sample csv collected data
  const data = 'x,y,word\n10,5,happy\n2,7,telephone';
  uploadFile('data', data, 'subject123.csv');
}
