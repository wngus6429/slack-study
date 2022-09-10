import { Dispatch, useState, useCallback, SetStateAction } from 'react';
// 커스텀훅, 리액트 기본제공하는 훅.
// 그 훅을 하나로 합쳐서 새로운걸 만들어냄
// useState랑 useCallback을 이용해서 한번에 반환
// 타입스크립트 에러 방지를 위해서 any를 사용
// 제로초는 제네릭 T를 많이 쓴다고 하더라
// 제네릭 = 뭐가 들어올지 모르는 타입, 아무거나 받기 가능, 타입을 변수로 만듬
// 리턴의 타입도 자동으로 정해지게. 이게 장점
// : 뒷부분이 밑에 return 인자 3개랑 대응한다고 보면됨
type ReturnTypes<T = any> = [T, (e: any) => void, Dispatch<SetStateAction<T>>];
// 타스 = 안정성이 늘었지만 가독성이 시발..
// 자스 하는 사람은 타입 넣는 부분을 생략, ts하는 사람은 빨간색 떳을때 타입추가
const useInput = <T = any>(initialDate: T): ReturnTypes<T> => {
  const [value, setValue] = useState(initialDate);
  const handler = useCallback((e: any) => {
    setValue(e.target.value);
  }, []);
  return [value, handler, setValue];
};

export default useInput;
