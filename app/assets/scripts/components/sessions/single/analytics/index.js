import React from 'react';
import { PropTypes as T } from 'prop-types';
import styled from 'styled-components';

import { getTarget } from '../../../../utils/targets';
import { getArrow } from '../../../../utils/arrows';
import { themeVal } from '../../../../styles/utils/general';
import collecticon from '../../../../styles/collecticons';
import { glsp } from '../../../../styles/utils/theme-values';

import Target from '../../../common/target';
import Heading from '../../../../styles/type/heading';
import { visuallyHidden } from '../../../../styles/helpers';
import Table from '../../../../styles/table';
import { arrayRange } from '../../../../utils/array';
import get from 'lodash.get';
import { round } from '../../../../utils/format';
import Dl from '../../../../styles/type/definition-list';

const Inpage = styled.div`
  display: grid;
  grid-gap: ${glsp(2)};
`;

const TargetList = styled.ul`
  display: grid;
  justify-content: center;
  grid-gap: ${glsp(2)};
`;

const TargetListItem = styled.li`
  display: grid;
  grid-gap: ${glsp()};
  grid-template-columns: 1fr 1fr;
  align-items: center;

  > ${Heading} {
    grid-column: span 2;
  }
`;

const TargetHeatmap = styled.div`
  grid-column: span 1;
  width: 15rem;
`;

const TargetStats = styled.div`
  grid-column: span 1;

  ${Dl} {
    grid-row-gap: ${glsp(0.5)};
  }
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

const HitTargets = styled.section`
  > ${Heading} {
    ${visuallyHidden()}
  }
`;

const HitBreakdown = styled.section`
  > ${Heading} {
    ${visuallyHidden()}
  }

  tr th:not(:first-child),
  tr td:not(:first-child) {
    text-align: right;
  }

  tr:last-child {
    font-weight: ${themeVal('type.base.bold')};
  }
`;

function Analytics (props) {
  const {
    config: { rounds, arrows, target },
    hits
  } = props.session;

  const targetDef = getTarget(target);
  const arrowDef = getArrow(arrows.type);

  const getArrowStats = (aIdx) => {
    const arrowHits = hits.reduce((acc, round) => {
      return round[aIdx] ? acc + 1 : acc;
    }, 0);

    const centroid = hits
      .reduce(
        (acc, round) => {
          const arrow = round[aIdx];
          if (!arrow) return acc;

          const { cx, cy } = arrow;
          const [x, y] = acc;
          return [x + cx, y + cy];
        },
        [0, 0]
      )
      .map((v) => v / arrowHits || 0);

    const extent = hits.reduce(
      (acc, round) => {
        const arrow = round[aIdx];
        if (!arrow) return acc;
        const { cx, cy } = arrow;
        if (!acc) {
          return [
            [cx, cy],
            [cx, cy]
          ];
        }

        const [[xMin, yMin], [xMax, yMax]] = acc;
        return [
          [Math.min(xMin, cx), Math.min(yMin, cy)],
          [Math.max(xMax, cx), Math.max(yMax, cy)]
        ];
      },
      // Init as null so the first is taken into account.
      null
    ) || [
      [0, 0],
      [0, 0]
    ];

    const distance = [
      Math.abs(extent[0][0] - extent[1][0]),
      Math.abs(extent[0][1] - extent[1][1])
    ];

    return {
      center: centroid.map((v) => round(v)),
      area: round(((distance[0] / 2) * (distance[1] / 2) * Math.PI) / 100),
      roundness: round(distance[0] / distance[1])
    };
  };

  return (
    <Inpage>
      <HitTargets>
        <Heading>Targets</Heading>
        <TargetList>
          {arrows.ids.map((a, aIdx) => {
            const arrowStats = getArrowStats(aIdx);
            return (
              <TargetListItem key={a}>
                <ArrowId as='h2' size='large'>
                  {a}
                </ArrowId>
                <TargetHeatmap>
                  <Target
                    rings={targetDef.rings}
                    arrow={arrowDef}
                    hits={hits.map((round) => round[aIdx])}
                  />
                </TargetHeatmap>
                <TargetStats>
                  <Dl type='horizontal'>
                    <dt>Group center</dt>
                    <dd>
                      <em>x:</em> {arrowStats.center[0]} <em>y:</em>{' '}
                      {arrowStats.center[1]}
                    </dd>
                    <dt>Group area</dt>
                    <dd>
                      {arrowStats.area || 0} cm<sup>2</sup>
                    </dd>
                    <dt>Group roundness</dt>
                    <dd>{arrowStats.roundness || 0}</dd>
                  </Dl>
                </TargetStats>
              </TargetListItem>
            );
          })}
        </TargetList>
      </HitTargets>
      <HitBreakdown>
        <Heading size='medium'>Breakdown</Heading>
        <Table>
          <thead>
            <tr>
              <th>#</th>
              {arrows.ids.map((a) => (
                <th key={a}>{a}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {
              // There are as many rows as rounds defined in the settings.
              // We have to create a range because the results array will be
              // filled as it is scored.
              arrayRange(1, rounds).map((s, sIdx) => {
                return (
                  <tr key={s}>
                    <td>{s}</td>
                    {arrows.ids.map((a, aIdx) => {
                      const arrowHit = get(hits, [sIdx, aIdx, 'value'], '');
                      return <td key={`${s}-${a}`}>{arrowHit}</td>;
                    })}
                  </tr>
                );
              })
            }
            <tr>
              <td>Total</td>
              {arrows.ids.map((a, aIdx) => {
                const sum = hits.reduce((acc, round) => {
                  return acc + get(round, [aIdx, 'value'], 0);
                }, 0);
                return <td key={a}>{sum}</td>;
              })}
            </tr>
          </tbody>
        </Table>
      </HitBreakdown>
    </Inpage>
  );
}

Analytics.propTypes = {
  session: T.object
};

export default Analytics;

// Group Center is the statistical center of the shot group. The first number is the X-coordinate center, the second number if the Y-coordinate center. Both numbers are in millimeters.
// Group Area is the size of the statistical representation of the shot group. It is also the size of the shot group ellipse. This is measured in millimeters squared.
// Group Roundness is a unit-less metric measuring how round the shot group is. A shot group with roundness 1.00 is perfectly round. A roundness value greater than 1 is more elongated along the X-axis, less then 1 the group is more elongated along the Y-axis. Groups with a roundness between .75 and 1.50 may generally be considered round.
