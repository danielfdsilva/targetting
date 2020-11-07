import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { PropTypes as T } from 'prop-types';
import styled, { css } from 'styled-components';
import get from 'lodash.get';

import { arrayRange, arraySort } from '../../../../utils/array';

import Table from '../../../../styles/table';
import { getSessionScore } from '../../../../utils/utils';
import { themeVal } from '../../../../styles/utils/general';
import Button from '../../../../styles/button/button';
import { visuallyHidden } from '../../../../styles/helpers';

const SummaryCell = styled.td`
  && {
    text-align: right;
  }

  ${({ isHidden }) =>
    isHidden &&
    css`
      span {
        ${visuallyHidden()}
      }
    `}
`;

const ActionsCell = styled.td`
  width: 1px;
`;

const SummaryRow = styled.tr`
  td:last-child {
    text-align: right;
    font-weight: ${themeVal('type.base.bold')};
  }
`;

class Results extends Component {
  renderTableRow (seriesNo) {
    const sIdx = seriesNo - 1; // Zero indexed.
    const { session } = this.props;
    const {
      config: { arrows },
      hits
    } = session;

    // Hits for the current round.
    const roundHits = get(hits, [sIdx], []);
    // Results are displayed sorted regardless of actual order.
    const sortedRoundHits = arraySort(roundHits, 'value');
    // Get the hits until this round to compute the totals.
    // This will be an array of arrays where each entry is a round.
    // [[ hit hit hit ], [ hit hit hit ]]
    const hitsUntilRound = hits.slice(0, seriesNo);
    // Compute the total by summing the value of all the hits until the
    // round being rendered. If the number of "hitsUntilRound" is not the same
    // as the current series being rendered, means that we're rendering an
    // empty row.
    const total =
      hitsUntilRound.length === seriesNo
        ? hitsUntilRound.reduce((tot, ht) => {
          // Safe check. If total was nullified, return.
          if (tot === null) return null;
          // If not arrows were fired for this round we assume we're mid round
          // and do not render it yet.
          if (ht.length !== arrows.ids.length) return null;
          // Sum points
          return tot + ht.reduce((sum, v) => sum + v.value, 0);
        }, 0)
        : null;

    return (
      <tr key={seriesNo}>
        <th>{seriesNo}</th>
        {arrayRange(1, arrows.ids.length).map((a, aIdx) => {
          const hitVal = get(sortedRoundHits, [aIdx, 'value'], '');
          return (
            <td key={`${seriesNo}-${a}`}>{hitVal === 10 ? 'X' : hitVal}</td>
          );
        })}
        <SummaryCell>
          {roundHits.length === arrows.ids.length
            ? roundHits.reduce((sum, v) => sum + v.value, 0)
            : null}
        </SummaryCell>
        <SummaryCell>{total}</SummaryCell>
        <ActionsCell>
          {roundHits.length === arrows.ids.length && (
            <Button
              element={Link}
              to={`/sessions/${session.id}/hits/${seriesNo}`}
              useIcon='pencil'
              size='small'
              hideText
            >
              Edit round
            </Button>
          )}
        </ActionsCell>
      </tr>
    );
  }

  render () {
    const { session } = this.props;
    const {
      config: { arrows, rounds },
      hits
    } = session;

    const isComplete = hits.length >= rounds;
    const finalScore = isComplete ? getSessionScore(session) : null;

    return (
      <Table>
        <thead>
          <tr>
            <th>#</th>
            {arrayRange(1, arrows.ids.length).map((a) => (
              <th key={a}>{a}</th>
            ))}
            <SummaryCell as='th'>Sub</SummaryCell>
            <SummaryCell as='th'>Total</SummaryCell>
            <SummaryCell as='th' isHidden>
              <span>Actions</span>
            </SummaryCell>
          </tr>
        </thead>
        <tbody>
          {
            // There are as many rows as rounds defined in the settings.
            // We have to create a range because the results array will be
            // filled as it is scored.
            arrayRange(1, rounds).map((s, sIdx) => this.renderTableRow(s, sIdx))
          }
          {isComplete && (
            <SummaryRow>
              <td colSpan={arrows.ids.length + 2}>Session complete</td>
              <SummaryCell>
                {finalScore.score} / {finalScore.max}
              </SummaryCell>
              <ActionsCell />
            </SummaryRow>
          )}
        </tbody>
      </Table>
    );
  }
}

Results.propTypes = {
  session: T.object
};

export default Results;
