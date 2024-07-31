import { check, sleep } from 'k6';
import http from 'k6/http';
import { describe, expect } from 'https://jslib.k6.io/k6chaijs/4.3.4.3/index.js';


let vu_1 = 50;
let vu_2 = 100;
let vu_3 = 200;
let vu_4 = 300;
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
      maxDuration: '280s',
    },
    scenario_3: {
      executor: 'per-vu-iterations',
      vus: vu_3,
      iterations: iterations,
      startTime: '280s',
      maxDuration: '540s',
    },
    scenario_4: {
      executor: 'per-vu-iterations',
      vus: vu_4,
      iterations: iterations,
      startTime: '540s'
    },

  },
};

export function setup() {
    const res_devserver = http.get('http://flask-devserver:8080/users');
    const res_wsgi = http.get('http://flask-wsgi:8081/users');
    return {
      n_users_devserver: res_devserver.json().number_of_users,
      n_users_wsgi: res_wsgi.json().number_of_users
    };
  
}

export default function () {
  const res_devserver = http.get('http://flask-devserver:8080/new_user');
  const res_wsgi = http.get('http://flask-wsgi:8081/new_user');
  check(res_devserver, { 'status is 200': (r) => r.status === 200 }, { server_type: "devserver" });
  check(res_wsgi, { 'status is 200': (r) => r.status === 200 }, { server_type: "wsgi" });
  sleep(1);
}

export function teardown(data) {
  let n_users_prev_devserver = data.n_users_devserver;
  let n_users_prev_wsgi = data.n_users_wsgi;
  const res_devserver = http.get('http://flask-devserver:8080/users');
  const res_wsgi = http.get('http://flask-wsgi:8081/users');
  let n_users_now_devserver = res_devserver.json().number_of_users;
  let n_users_now_wsgi = res_wsgi.json().number_of_users;
  let expected_increase = (vu_1 + vu_2 + vu_3 + vu_4) * iterations;

  describe('SMOKE TEST DEVSERVER', () => {
    expect(n_users_prev_devserver + expected_increase).to.equal(n_users_now_devserver);
  });
  describe('SMOKE TEST WSGI', () => {
    expect(n_users_prev_wsgi + expected_increase).to.equal(n_users_now_wsgi);
  });
}