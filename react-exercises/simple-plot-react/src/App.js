import React from 'react';
import logo from './logo.svg';
import { Line, Bar } from './chartjs/index';

function App() {
  return (
    <>
      <Bar
        data={{
          labels: ['win', 'loose', 'run', 'dead', 'fly', 'quit', 'dd', 'ddd1', 'ddd', 'ddd2', 'ddd3', 'dd5'],
          datasets: [{
            label: 'People',
            backgroundColor: [
              'rgba(0, 0, 255, 0.5)',
              'rgba(0, 255, 0, 0.5)',
              'rgba(255, 0, 0, 0.5)',
              'rgba(0, 255, 0, 0.5)',
              'rgba(0, 0, 255, 0.5)',
              'rgba(255, 0, 0, 0.5)',
              'rgba(0, 0, 255, 0.5)',
              'rgba(0, 255, 0, 0.5)',
              'rgba(255, 0, 0, 0.5)',
              'rgba(0, 255, 0, 0.5)',
              'rgba(0, 0, 255, 0.5)',
              'rgba(255, 0, 0, 0.5)',
            ],
            data:[43, 15, 82, 40, 45, 50, 28, 90, 70, 20, 50, 40]
          }]
        }}
      />
    </>
  );
}
//**largedata (shrinks accordingly)
// Array.from({length: 40}, () => Math.floor(Math.random() * 1000))
// Array.from({length: 40}, (x, i) => 'sss'+i);

//[83, 15, 82]
//['win', 'loose', 'run']

export default App;
