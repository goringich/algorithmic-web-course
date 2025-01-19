import React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';

const MyButton = ({ label, onClick, variant }) => {
  return (
    <Button variant={variant} onClick={onClick}>
      {label}
    </Button>
  );
};

MyButton.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(['contained', 'outlined', 'text']),
};

MyButton.defaultProps = {
  onClick: () => {},
  variant: 'contained',
};

export default MyButton;
