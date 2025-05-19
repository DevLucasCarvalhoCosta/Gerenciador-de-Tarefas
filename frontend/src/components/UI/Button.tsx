import React from 'react';
import { Button as AntButton, ButtonProps as AntButtonProps } from 'antd';

export interface ButtonProps extends AntButtonProps {}

const Button: React.FC<ButtonProps> = (props) => {
  return <AntButton {...props} />;
};

export default Button;