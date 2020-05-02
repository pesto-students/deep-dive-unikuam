/**
 * @jest-environment jsdom
 */

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

// test('renders learn react link', () => {
//   //const closeFn = jest.fn();
  
//   const container = shallow(
//   <ModalReact focusOnFirstElement
//   closeOnEscape
//   focusChangeOnTab
//   hideOnOverlayTouch toggleButtonId="modalReactButton">
//     Hello world
//   </ModalReact>
//   );
//   console.log('container: ', container);
//   const overlay = container.find('.modalReact');
//   expect(overlay).toHaveLength(1);
//   // const modal = overlay.find('.modal');
//   // expect(overlay).toHaveLength(1);
//   // expect(modal.text()).toEqual('Hello World');
// });
