import { EComponentKind, T4DComponentConfig } from '@ws-ui/webform-editor';
import { Settings } from '@ws-ui/webform-editor';
import { GiArtificialIntelligence } from "react-icons/gi";

import AiDisplayerSettings, { BasicSettings } from './AiDisplayer.settings';

export default {
  craft: {
    displayName: 'AiDisplayer',
    kind: EComponentKind.BASIC,
    props: {
      name: '',
      classNames: [],
      events: [],
    },
    related: {
      settings: Settings(AiDisplayerSettings, BasicSettings),
    },
  },
  info: {
    settings: AiDisplayerSettings,
    displayName: 'AiDisplayer',
    exposed: true,
    icon: GiArtificialIntelligence,
    events: [
      {
        label: 'On Click',
        value: 'onclick',
      },
      {
        label: 'On Blur',
        value: 'onblur',
      },
      {
        label: 'On Focus',
        value: 'onfocus',
      },
      {
        label: 'On MouseEnter',
        value: 'onmouseenter',
      },
      {
        label: 'On MouseLeave',
        value: 'onmouseleave',
      },
      {
        label: 'On KeyDown',
        value: 'onkeydown',
      },
      {
        label: 'On KeyUp',
        value: 'onkeyup',
      },
    ],
    datasources: {
      accept: ['string'],
    },
  },
  defaultProps: {
    style:{
      width: '100%',
      height: '500px',
    }
  },
} as T4DComponentConfig<IAiDisplayerProps>;

export interface IAiDisplayerProps extends webforms.ComponentProps {
}
