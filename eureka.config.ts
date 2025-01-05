import { Eureka } from 'eureka-js-client';

export const eurekaClient = new Eureka({
  // Eureka 서버 URL
  eureka: {
    host: 'localhost', // Eureka 서버 호스트
    port: 8673, // Eureka 서버 포트
    servicePath: '/eureka/apps/', // 서비스 등록 경로
  },
  instance: {
    app: 'auth', // 등록할 서비스 이름
    hostName: 'localhost',
    ipAddr: '127.0.0.1', // 서비스의 IP 주소
    statusPageUrl: `http://localhost:3000/info`,
    port: {
      $: 3000,
      '@enabled': true,
    },
    vipAddress: 'auth', // 다른 서비스들이 호출할 주소
    dataCenterInfo: {
      '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
      name: 'MyOwn',
    },
  },
});
