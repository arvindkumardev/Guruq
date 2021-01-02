import React from 'react';
import PropTypes from 'prop-types';
import IconButtonWrapper from '../IconWrapper';
import { RfH, RfW } from '../../utils/helpers';
import { Images } from '../../theme';

const BackArrow = (props) => {
  const { action, whiteArrow } = props;
  return (
    <IconButtonWrapper
      iconHeight={RfH(36)}
      iconWidth={RfW(36)}
      iconImage={whiteArrow ? Images.backArrow_white : Images.backArrow}
      submitFunction={action}
    />
  );
};

BackArrow.propTypes = {
  action: PropTypes.func.isRequired,
  whiteArrow: PropTypes.bool,
};

export default BackArrow;
