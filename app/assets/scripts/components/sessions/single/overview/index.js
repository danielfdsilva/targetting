import React from 'react';
import { PropTypes as T } from 'prop-types';
import styled from 'styled-components';
import { rgba } from 'polished';

import { themeVal } from '../../../../styles/utils/general';
import { visuallyHidden } from '../../../../styles/helpers';
import { format } from 'date-fns';
import { getArrow } from '../../../../utils/arrows';
import { getTarget } from '../../../../utils/targets';
import { glsp } from '../../../../styles/utils/theme-values';
import Dl from '../../../../styles/type/definition-list';

const OverviewSelf = styled.div`
  display: grid;
  grid-gap: ${glsp(2)};
`;

const NotesHeading = styled.h2`
    font-feature-settings: "pnum" 0; /* Use proportional numbers */
    font-family: ${themeVal('type.heading.family')};
    font-weight: ${themeVal('type.heading.regular')};
    text-transform: uppercase;
    color: ${({ theme }) => rgba(theme.type.base.color, 0.64)};
    font-size: 0.875rem;
    line-height: 1.25rem;
`;

const DetailsSection = styled.div`
  h2 {
    ${visuallyHidden()}
  }
`;

function Overview (props) {
  const {
    date,
    distance,
    config: { rounds, arrows, target },
    notes
  } = props.session;

  return (
    <OverviewSelf>
      <DetailsSection>
        <h2>Details</h2>
        <Dl type='horizontal'>
          <dt>Date</dt>
          <dd>{format(new Date(date), 'dd MMMM yyyy')}</dd>
          <dt>Distance</dt>
          <dd>{distance}m</dd>
          <dt>Rounds</dt>
          <dd>{rounds}</dd>
          <dt>Arrows</dt>
          <dd>
            {arrows.ids.length} ({getArrow(arrows.type).name})
          </dd>
          <dt>Target</dt>
          <dd>{getTarget(target).name}</dd>
        </Dl>
      </DetailsSection>
      <div>
        <NotesHeading>Notes</NotesHeading>
        <p>{notes || 'There are no notes.'}</p>
      </div>
    </OverviewSelf>
  );
}

Overview.propTypes = {
  session: T.object
};

export default Overview;
