import axios from 'axios';

//? withCredentials는 프론트 백엔드 각각 포트가 달라서 쿠키 전달이
//? 안되는것을 해결해준다, get은 두번쨰, post는 3번째에 적는다.
//! 백엔드에서 프론트로 쿠키생성도 되고 프론트에서 백엔드로 데이터도 전달이됨
//! 쿠키는 백엔드가 만들어내는거고 백엔드에서 받아서 브라우저에 저장
const fetcher = (url: string) =>
  axios
    .get(url, {
      withCredentials: true,
    })
    .then((response) => response.data);

export default fetcher;
