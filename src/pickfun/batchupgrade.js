import fs from 'fs';

const baseUrl = 'https://api.pick-fun.com.cn/app/common/deviceForceUpgradeUrl?md5=0b05e202278358b93108e5d9154aea6b&size=131039540&sn=';
const urlSuffix = '&url=https%3A%2F%2Fmaterial.pick-fun.com.cn%2Fupgrade_package%2Fdepi_net0.2.1015.13267_1723703407325.tar.gz';

function generateURLs(fileName) {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        const sns = data.trim().split('\n').map(sn => sn.trim('\n'));
        const urls = sns.map(sn => ({sn: sn, url: baseUrl + sn + urlSuffix}));
        resolve(urls);
      }
    });
  });
}

generateURLs('sn.txt')
  .then(urls => {
    //iterate the urls array
    urls.forEach(url => {
      //fs.writeFileSync('urls.txt', url + '\n', { flag: 'a+' });
      //console.log(JSON.stringify(url));
      fetch(url.url, {method: 'GET'}).then(response => {
        console.log(url.sn + ' ' + response.status);
      })
    });
  })
  .catch(err => {
    console.error('Error reading SNs:', err);
  });