// Downloads styles and icons from the MBTA style guide
const https = require('https');
const fs = require('fs');

// TODO: I want to use async/await here, but it looks like https doesn't support that,
// and I'd need to get something like axios
const downloadFile = (url, filename) => {
  const file = fs.createWriteStream(filename);
  https.get(
    url,
    // TODO: handle errors
    (response) => {
      response.pipe(file);
    }
  );
}

downloadFile(
  'https://projects.invisionapp.com/dsm-export/mbta-customer-technology/digital-style-guide/_style-params.scss?key=r1dZGZBoz',
  'src/styles/_style-params.scss'
);

// TODO: unzip this as part of this script
downloadFile(
  'https://projects.invisionapp.com/dsm-export/mbta-customer-technology/digital-style-guide/icons.zip?key=r1dZGZBoz',
  'src/icons.zip'
);
