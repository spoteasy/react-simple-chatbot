import React from 'react';
import PropTypes from 'prop-types';

const PencilIcon = ({ size, color, ...props }) => (
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
      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
    />
  </svg>
);

PencilIcon.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string
};

PencilIcon.defaultProps = {
  size: 20,
  color: 'currentColor'
};

export default PencilIcon;
