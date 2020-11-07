import React, { Component } from 'react';
import { PropTypes as T } from 'prop-types';
import styled from 'styled-components';

import { getTarget } from '../../../../utils/targets';
import { getArrow } from '../../../../utils/arrows';
import { themeVal } from '../../../../styles/utils/general';
import collecticon from '../../../../styles/collecticons';
import { multiply } from '../../../../styles/utils/math';

import Target from '../../../common/target';
import Heading from '../../../../styles/type/heading';

const Wrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;

  > *:not(:last-child) {
    margin-bottom: ${multiply(themeVal('layout.space'), 2)}
  }
`;

const TargetHeatmap = styled.article`
  width: 100%;
  max-width: 15rem;
`;

const ArrowId = styled(Heading)`
  text-align: center;

  &::before {
    ${collecticon('compass-2')}
    vertical-align: top;
    margin-right: 0.5rem;
    font-size: 1rem;
  }
`;

class Analytics extends Component {
  render () {
    const {
      config: { arrows, target },
      hits
    } = this.props.session;

    const targetDef = getTarget(target);
    const arrowDef = getArrow(arrows.type);

    return (
      <Wrapper>
        {arrows.ids.map((a, aIdx) => (
          <TargetHeatmap key={a}>
            <ArrowId size='large'>{a}</ArrowId>
            <Target
              rings={targetDef.rings}
              arrow={arrowDef}
              hits={hits.map(round => round[aIdx])}
            />
          </TargetHeatmap>
        ))}
      </Wrapper>
    );
  }
}

Analytics.propTypes = {
  session: T.object
};

export default Analytics;
