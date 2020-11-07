import React from 'react';
import { Link } from 'react-router-dom';

import App from '../common/app';
import Constrainer from '../../styles/constrainer';
import Prose from '../../styles/type/prose';

export default class UhOh extends React.Component {
  render () {
    return (
      <App pageTitle='Not found'>
        <Constrainer>
          <Prose as='article'>
            <header>
              <h1>Page not found</h1>
            </header>
            <div>
              <p>We were not able to find the page you are looking for. It may have been archived or removed.</p>
              <p>If you think this page should be here let us know via <a href='https://github.com/danielfdsilva/targetting/issues/' title='View github issues'>a github issue</a>.</p>
              <p><Link to='/' title='Visit the homepage'>Visit the homepage</Link></p>
            </div>
          </Prose>
        </Constrainer>
      </App>
    );
  }
}
