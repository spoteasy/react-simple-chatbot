import React from 'react';
import PropTypes from 'prop-types';

const XCircleIcon = ({ size, color, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke={color}
    className="w-6 h-6"
    width={size}
    height={size}
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

XCircleIcon.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string
};

XCircleIcon.defaultProps = {
  size: 20,
  color: 'currentColor'
};

export default XCircleIcon;
