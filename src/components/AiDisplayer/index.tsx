import config, { IAiDisplayerProps } from './AiDisplayer.config';
import { T4DComponent, useEnhancedEditor } from '@ws-ui/webform-editor';
import Build from './AiDisplayer.build';
import Render from './AiDisplayer.render';

const AiDisplayer: T4DComponent<IAiDisplayerProps> = (props) => {
  const { enabled } = useEnhancedEditor((state) => ({
    enabled: state.options.enabled,
  }));

  return enabled ? <Build {...props} /> : <Render {...props} />;
};

AiDisplayer.craft = config.craft;
AiDisplayer.info = config.info;
AiDisplayer.defaultProps = config.defaultProps;

export default AiDisplayer;
