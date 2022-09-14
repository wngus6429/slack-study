import axios from 'axios';

//? withCredentials는 프론트 백엔드 각각 포트가 달라서 쿠키 전달이
//? 안되는것을 해결해준다, get은 두번쨰, post는 3번째에 적는다.
//! 백엔드에서 프론트로 쿠키생성도 되고 프론트에서 백엔드로 데이터도 전달이됨
//! 쿠키는 백엔드가 만들어내는거고 백엔드에서 받아서 브라우저에 저장

const fetcher = (url: string) => {
  return axios
    .get(url, {
      withCredentials: true,
    })
    .then((response) => response.data);
  //서버에서 받는 데이터를 그대로 프론트에 저장하는 상태
  // swr를 100% 이용 못하고 있는거, fetcher를 다양하게
};
// fetcher를 다양하게 만들면 좋다 여러개.. 이런식으로
// const fetcherlength = (url: string) => {
//   return axios
//     .get(url, {
//       withCredentials: true,
//     })
//     .then((response) => response.data.length);
// };

export default fetcher;
