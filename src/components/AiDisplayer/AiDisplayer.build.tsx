import { useEnhancedNode } from '@ws-ui/webform-editor';
import cn from 'classnames';
import { FC } from 'react';

import { IAiDisplayerProps } from './AiDisplayer.config';

const AiDisplayer: FC<IAiDisplayerProps> = ({  style, className, classNames = [] }) => {
  const {
    connectors: { connect },
  } = useEnhancedNode();

  return (
    <span ref={connect} style={style} className={cn(className, classNames)}>
      Hello , what can I display?
    </span>
  );
};

export default AiDisplayer;