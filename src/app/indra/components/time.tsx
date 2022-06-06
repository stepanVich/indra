import React, {useEffect, useState} from 'react';

export default function Time() {
  const [dt, setDt] = useState(new Date().toLocaleString());

  useEffect(() => {
    let secTimer = setInterval(() => {
      setDt(new Date().toLocaleString());
    }, 1000);

    return () => clearInterval(secTimer);
  }, []);

  return <span style={{verticalAlign: 'middle', fontWeight: 'bold', color: '#9cd1e0'}}>{dt}</span>;
}
