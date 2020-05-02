import React from 'react';
import { render } from '@testing-library/react';
import App from './App';
import ModalReact from './components/ModalReact.jsx';
// test('renders learn react link', () => {
//   const { getByText } = render(<App />);
//   const linkElement = getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });

const root = document.createElement('button');
root.id = 'buttonId';
it('renders without crashing', () => {
  expect(<ModalReact
       toggleButtonId={root}>
        Hello world
      </ModalReact>).toBe('dddd');
});
