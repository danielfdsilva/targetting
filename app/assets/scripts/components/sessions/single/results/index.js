import React, { Component } from 'react';
import { PropTypes as T } from 'prop-types';
import styled from 'styled-components';
import get from 'lodash.get';

import { arrayRange, arraySort } from '../../../../utils/array';

import Table from '../../../../styles/table';

const SummaryCell = styled.td`
  && {
    text-align: right;
  }
`;

class Results extends Component {
  renderTableRow (seriesNo) {
    const sIdx = seriesNo - 1; // Zero indexed.
    const {
      config: { arrows },
      hits
    } = this.props.session;

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
    const total = hitsUntilRound.length === seriesNo
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
            <td key={`${seriesNo}-${a}`}>
              {hitVal === 10 ? 'X' : hitVal}
            </td>
          );
        })}
        <SummaryCell>
          {roundHits.length === arrows.ids.length
            ? roundHits.reduce((sum, v) => sum + v.value, 0)
            : null}
        </SummaryCell>
        <SummaryCell>{total}</SummaryCell>
      </tr>
    );
  }

  render () {
    const {
      config: { arrows, rounds },
      hits
    } = this.props.session;

    const isComplete = hits.length >= rounds;

    return (
      <Table>
        <thead>
          <tr>
            <th>#</th>
            {arrayRange(1, arrows.ids.length).map(a => (
              <th key={a}>{a}</th>
            ))}
            <SummaryCell as='th'>Sub</SummaryCell>
            <SummaryCell as='th'>Total</SummaryCell>
          </tr>
        </thead>
        <tbody>
          {
            // There are as many rows as rounds defined in the settings.
            // We have to create a range because the results array will be
            // filled as it is scored.
            arrayRange(1, rounds).map((s, sIdx) => this.renderTableRow(s, sIdx))
          }
          {
            isComplete && (
              <tr>
                <td colSpan={arrows.ids.length + 3}>Session complete</td>
              </tr>
            )
          }
        </tbody>
      </Table>
    );
  }
}

Results.propTypes = {
  session: T.object
};

export default Results;
