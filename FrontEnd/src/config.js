// export const API_URL =  'https://api.funnelsmap.com';
// export const API_URL = window.location.protocol === 'https:' ? 'https://api.funnelsmap.com' : 'http://api.funnelsmap.com';
// export const API_URL = 'https://api.funnelsmap.com';
// export const API_URL = 'https://funnelsmapbackend.qbex.io';
// export const API_URL = 'http://localhost:9001';
// export const API_URL = 'http://ec2-3-124-11-139.eu-central-1.compute.amazonaws.com:9001';
// export const API_URL =
//   process.env.REACT_APP_BUILD === 'amazon' ?
//     'http://ec2-3-124-11-139.eu-central-1.compute.amazonaws.com:9001' :
//     process.env.REACT_APP_BUILD === 'prod' ? 'https://api.funnelsmap.com' :
//       'http://ec2-3-124-11-139.eu-central-1.compute.amazonaws.com:9001'



let API_URL = 'http://localhost:9001'

switch (process.env.REACT_APP_BUILD) {
  case 'amazon':
    API_URL = 'http://ec2-3-124-11-139.eu-central-1.compute.amazonaws.com:9001'
    break;
  case 'prod':
    API_URL = 'https://api.funnelsmap.com'
    break;
  default:
    //API_URL = 'http://ec2-3-124-11-139.eu-central-1.compute.amazonaws.com:9001'
    API_URL = 'http://localhost:9001'

}

export default API_URL