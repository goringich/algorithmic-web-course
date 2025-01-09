// Установка Emotion
// npm install @emotion/react @emotion/styled

import React from 'react';
import styled from '@emotion/styled';

const StyledButton = styled.button`
  background: ${(props) => (props.primary ? 'blue' : 'gray')};
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.3s;
  &:hover {
    background: ${(props) => (props.primary ? 'darkblue' : 'darkgray')};
  }
`;

const App = () => {
  return (
    <div>
      <StyledButton primary>Primary Button</StyledButton>
      <StyledButton>Secondary Button</StyledButton>
    </div>
  );
};

export default App;
