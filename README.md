# Running Apach Nifi API with Node.js

This library provides several functions in Apach Nifi API

Apach Nifi API Page : <https://nifi.apache.org/docs/nifi-docs/rest-api/index.html>

This Version can change state of one Nifi processor to 'RUNNING' or 'STOPPED' and 'RUN_ONCE'

24-04-05 Update

1.  Chnage 'token' param position so if you want call this lib method Please check 'Sample Code' and fix your code
2.  Add No Auth Case

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
    'nifi_processor_id',
    token
  );

  // Set Processor Status : 'RUNNING', 'STOPPED', 'RUN_ONCE'
  await nifi.set_state(
    init,
    processor_data,
    'RUNNING',
    token
  );

  // Run Once Processor
  await nifi.set_run_once(init, processor_data, token)
}

test_func();

```

## Sample Code (NO Auth)

```
const nifi = require('nifi-api-req');

async function test_func() {
  // Input Nifi Ip, Port
  let init = nifi.nifi_init('localhost', '8443');

  // 'nifi_processor_id' = Input target processor Id
  let processor_data = await nifi.get_processor_info(
    init,
    'nifi_processor_id'
  );

  // Set Processor Status : 'RUNNING', 'STOPPED', 'RUN_ONCE'
  await nifi.set_state(
    init,
    processor_data,
    'RUNNING'
  );

  // Run Once Processor
  await nifi.set_run_once(init, processor_data)
}

test_func();

```
