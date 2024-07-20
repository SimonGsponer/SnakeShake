import { check, sleep } from 'k6';
import http from 'k6/http';

export const options = {
    stages: [
        {duration: '10s', target: 100},
        {duration: '20s', target: 200},
        {duration: '30s', target: 300},
        {duration: '30s', target: 400},
        {duration: '30s', target: 500},
        {duration: '30s', target: 600},
        {duration: '60s', target: 0}
    ]
  };

export default function () {
  const res = http.get('http://flask:8080/');
  check(res, {
    'is status 200': (r) => r.status === 200,
  });
  sleep(1);
}