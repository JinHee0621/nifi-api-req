# Running Apach Nifi API with Node.js

This library provides several functions in Apach Nifi API

Apach Nifi API Page : <https://nifi.apache.org/docs/nifi-docs/rest-api/index.html>

This Version can change state of one Nifi processor to 'RUNNING' or 'STOPPED' and 'Run Once'

## Sample Code

```
const nifi = require('nifi-api-req');

async function test_func() {
  // Input Nifi Ip, Port
  let init = nifi.nifi_init('localhost', '8443');

  // Input User, Pwd
  let token = await nifi.user_init(init, 'nifi_User', 'nifi_Password');

  // 'nifi_processor_id' = Input target processor Id
  let processor_data = await nifi.get_processor_info(
    init,
    token,
    'nifi_processor_id'
  );

  // Set Processor Status : 'RUNNING', 'STOPPED'
  await nifi.set_state(
    init,
    token,
    processor_data,
    'RUNNING'
  );

  // Run Once Processor
  await nifi.set_run_once(init, token, processor_data)
}

test_func();

```
