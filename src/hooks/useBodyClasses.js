import { useEffect } from 'react';

const useBodyClasses = (...styles) => {
  useEffect(() => {
    document.querySelector('body').classList.add(...styles);
    return () => document.querySelector('body').classList.remove(...styles);
  });
};

export default useBodyClasses;
