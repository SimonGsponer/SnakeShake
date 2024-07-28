import { check, sleep } from 'k6';
import http from 'k6/http';
import exec from 'k6/execution';
import { describe, expect } from 'https://jslib.k6.io/k6chaijs/4.3.4.3/index.js';



let vu_1 = 50;
let vu_2 = 100; //100
let vu_3 = 300; //300
let iterations = 100;


export const options = {
  thresholds: {
    http_req_failed: ['rate===0.00'], // there should be no http errors
    http_req_duration: ['p(95)<200'], // 95% of requests should be below 200ms
  },
  scenarios: {
    scenario_1: {
      executor: 'per-vu-iterations',
      vus: vu_1,
      iterations: iterations,
      maxDuration: '120s',
    },
    scenario_2: {
      executor: 'per-vu-iterations',
      vus: vu_2,
      iterations: iterations,
      startTime: '120s',
      maxDuration: '240s',
    },
    scenario_3: {
      executor: 'per-vu-iterations',
      vus: vu_3,
      iterations: iterations,
      startTime: '240s',
      maxDuration: '300s',
    },

  },
};

export function setup() {
    const res = http.get('http://flask:8080/users');
    return { n_users: res.json().number_of_users };
  
}

export default function () {
  const res = http.get('http://flask:8080/new_user');
  // check(res, {
  //   'is status 200': (r) => r.status === 200,
  // });
  check(res, { 'status is 200': (r) => r.status === 200 }, { server_type: "devserver" });
  sleep(1);
}

export function teardown(data) {
  let n_users_previously = data.n_users;
  const res = http.get('http://flask:8080/users');
  let n_users_now = res.json().number_of_users;
  let expected_increase = (vu_1 + vu_2 + vu_3) * iterations;

  describe('SMOKE TEST', () => {
    expect(n_users_previously + expected_increase).to.equal(n_users_now);
  });
}