import React from 'react';
import PropTypes from 'prop-types';
import { IconButtonWrapper } from '../index';
import { RfH, RfW } from '../../utils/helpers';
import { Images } from '../../theme';

const BackArrow = (props) => {
  const { action } = props;
  return (
    <IconButtonWrapper
      iconHeight={RfH(32)}
      iconWidth={RfW(32)}
      iconImage={Images.backArrow}
      submitFunction={() => action()}
    />
  );
};

BackArrow.propTypes = {
  action: PropTypes.func.isRequired,
};

export default BackArrow;
