import React, { Component } from 'react';
import { PropTypes as T } from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { tint } from 'polished';
import { format } from 'date-fns';

import { themeVal, stylizeFunction } from '../../styles/utils/general';
import { visuallyHidden, truncated } from '../../styles/helpers';
import { multiply } from '../../styles/utils/math';
import collecticon from '../../styles/collecticons';

import Heading from '../../styles/type/heading';

const _tint = stylizeFunction(tint);

const SessionLink = styled(Link)`
  display: flex;
  align-items: center;
  padding: ${themeVal('layout.space')};

  &,
  &:visited {
    color: inherit;
  }

  > *:not(:last-child) {
    margin-right: ${multiply(themeVal('layout.space'), 1.5)};
  }
`;

const SessionScore = styled.div`
  margin-left: auto;

  span {
    font-size: 2rem;
  }
  small {
    font-size: 1rem;
  }
`;

const SessionDetail = styled.dd`
  display: flex;
  align-items: baseline;

  &::before {
    ${({ useIcon }) => collecticon(useIcon)}
    font-size: 0.75rem;
    margin-right: 0.25rem;
  }
`;

const SessionDate = styled(SessionDetail)`
  flex-basis: 100%;
`;

const SessionDetails = styled.dl`
  display: flex;
  flex-flow: row wrap;
  font-size: 1rem;
  line-height: 1.5rem;
  color: ${_tint(0.32, themeVal('type.base.color'))};

  dt {
    ${visuallyHidden()}
  }

  dd:not(:last-child) {
    margin-right: ${themeVal('layout.space')};
  }

  dd:last-child {
    min-width: 0;
    flex: 1;

    span {
      ${truncated()}
      display: block;
      min-width: 0;
    }
  }
`;

class Session extends Component {
  render () {
    const { id, name, date, distance, target, score, maxPoints } = this.props;
    return (
      <article>
        <SessionLink to={`/sessions/${id}`}>
          <div>
            <Heading size='large'>{name}</Heading>
            <SessionDetails>
              <dt>Date</dt>
              <SessionDate useIcon='calendar'>
                <time dateTime={date}>
                  {format(new Date(date), 'MMMM do yyyy')}
                </time>
              </SessionDate>
              <dt>Distance</dt>
              <SessionDetail useIcon='compass'>{distance}m</SessionDetail>
              <dt>Target</dt>
              <SessionDetail useIcon='target'>
                <span>{target}</span>
              </SessionDetail>
            </SessionDetails>
          </div>

          <SessionScore>
            <span>{score}</span>
            <small>/{maxPoints}</small>
          </SessionScore>
        </SessionLink>
      </article>
    );
  }
}

Session.propTypes = {
  id: T.string,
  name: T.string,
  date: T.string,
  distance: T.number,
  target: T.string,
  score: T.number,
  maxPoints: T.number
};

export default Session;
