const https = require('https');
const http = require('http');
const querystring = require('querystring');
const utils = require('./bin/utils');

const DEFAULT_INIT = {
  NIFI_IP: '127.0.0.1',
  NIFI_PORT: '8443',
};

//NIFI CLUSTER INIT
function nifi_init(ip, port) {
  if (ip == 'localhost') ip = '127.0.0.1';
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

async function get_processor_info(nifi, processor_id, token) {
  let header = '';
  let req = '';

  let path = '/nifi-api/processors/' + processor_id;

  return new Promise((resolve, reject) => {
    if (token !== undefined && token !== null && token !== '') {
      header = {
        Authorization: ' Bearer ' + token,
        'Content-Type': 'application/x-www-form-urlencoded',
      };
      req = https.request(
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
    } else {
      header = {
        'Content-Type': 'application/json',
      };
      req = http.request(
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
    }

    req.end();
  });
}
// state Type : 'RUNNING', 'STOPPED', 'RUN_ONCE'
async function set_state(nifi, info, state, token) {
  let header = '';
  let req = '';

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

  return new Promise((resolve, reject) => {
    if (token !== undefined && token !== null && token !== '') {
      header = {
        Authorization: ' Bearer ' + token,
        'Content-Type': 'application/json',
        'Content-Length': body.length,
      };

      req = https.request(
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
    } else {
      header = {
        'Content-Type': 'application/json',
        'Content-Length': body.length,
      };

      req = http.request(
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
    }

    req.write(body);
    req.end();
  });
}

async function set_run_once(nifi, info, token) {
  let run = await set_state(nifi, token, info, 'RUN_ONCE');
}

module.exports = {
  DEFAULT_INIT,
  nifi_init,
  user_init,
  get_processor_info,
  set_state,
  set_run_once,
};
