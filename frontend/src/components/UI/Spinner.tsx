import React from 'react';
import { Spin, SpinProps } from 'antd';

export interface SpinnerProps extends SpinProps {}

const Spinner: React.FC<SpinnerProps> = (props) => {
  return <Spin {...props} />;
};

export default Spinner;