import * as fs from 'fs';

const baseUrl = 'https://api.pick-fun.com.cn/app/common/deviceForceUpgradeUrl?md5=0b05e202278358b93108e5d9154aea6b&size=131039540&sn=';
const urlSuffix = '&url=https%3A%2F%2Fmaterial.pick-fun.com.cn%2Fupgrade_package%2Fdepi_net0.2.1015.13267_1723703407325.tar.gz';

type Device = {
  sn: string;
  url: string;
}

function generateURLs(fileName: string): Promise<Device[]> {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, 'utf8', (err: any, data: string) => {
      if (err) {
        reject(err);
      } else {
        const sns = data.trim().split('\n').map(sn => sn.trim());
        const devices = sns.map(sn => ({sn: sn, url: baseUrl + sn + urlSuffix}));
        resolve(devices);
      }
    });
  });
}

generateURLs('sn.txt')
  .then(devices => {
    //iterate the urls array
    devices.forEach(async d => {
      //fs.writeFileSync('urls.txt', d.url + '\n', { flag: 'a+' });
      //console.log(JSON.stringify(d));
      const resp = await fetch(d.url, {method: 'GET'});
      const res = await resp.json();
      console.log(`${d.sn}: ${res.code} - ${res.message}`);
    });
  })
  .catch(err => {
    console.error('Error reading SNs:', err);
  });