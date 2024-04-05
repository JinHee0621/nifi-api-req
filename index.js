const https = require('https');
const querystring = require('querystring');
const utils = require('./bin/utils');

const NIFI_INIT = {
  NIFI_IP: 'localhost',
  NIFI_PORT: '8443',
};

//NIFI CLUSTER INIT
function nifi_init(ip, port) {
  let nifi_ip_init = ip;
  let nifi_port_init = port;

  return {
    NIFI_IP: nifi_ip_init,
    NIFI_PORT: nifi_port_init,
  };
}

async function user_init(nifi, id, pwd) {
  const user_data = querystring.stringify({
    username: id,
    password: pwd,
  });

  const header = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': user_data.length,
  };

  return new Promise((resolve, reject) => {
    const req = https.request(
      utils.requestFormat(
        nifi.NIFI_IP,
        nifi.NIFI_PORT,
        '/nifi-api/access/token',
        'POST',
        header
      ),
      (res) => {
        let result = '';
        res.on('data', (data) => {
          result += data;
        });
        res.on('end', () => {
          resolve(result);
        });
      }
    );
    req.write(user_data);
    req.end();
  });
}

async function get_processor_info(nifi, token, processor_id) {
  let path = '/nifi-api/processors/' + processor_id;
  const header = {
    Authorization: ' Bearer ' + token,
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  return new Promise((resolve, reject) => {
    const req = https.request(
      utils.requestFormat(nifi.NIFI_IP, nifi.NIFI_PORT, path, 'GET', header),
      (res) => {
        let result = '';
        res.on('data', (data) => {
          result += data;
        });
        res.on('end', () => {
          resolve(result);
        });
      }
    );

    req.end();
  });
}

// state Type : 'RUNNING', 'STOPPED'
async function set_state(nifi, token, info, state) {
  info = JSON.parse(info);
  let path = '/nifi-api/processors/' + info['component']['id'];
  const body = JSON.stringify({
    revision: {
      clientId: info['revision']['clientId'] || '',
      version: info['revision']['version'],
    },
    component: {
      id: info['component']['id'],
      state: state,
    },
  });

  const header = {
    Authorization: ' Bearer ' + token,
    'Content-Type': 'application/json',
    'Content-Length': body.length,
  };

  return new Promise((resolve, reject) => {
    const req = https.request(
      utils.requestFormat(nifi.NIFI_IP, nifi.NIFI_PORT, path, 'PUT', header),
      (res) => {
        let buf = '';
        res.on('data', (data) => {
          buf += data;
        });
        res.on('end', () => {
          resolve('PROCESSOR ' + state);
        });
      }
    );
    req.write(body);
    req.end();
  });
}

async function set_run_once(nifi, token, info) {
  let run = await set_state(nifi, token, info, 'RUNNING');
  let stop = await set_state(nifi, token, info, 'STOPPED');
}

module.exports = {
  nifi_init,
  user_init,
  get_processor_info,
  set_state,
  set_run_once,
};
