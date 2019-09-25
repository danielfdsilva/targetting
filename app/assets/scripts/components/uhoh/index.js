import React from 'react';
import { Link } from 'react-router-dom';

import App from '../common/app';

export default class UhOh extends React.Component {
  render () {
    return (
      <App pageTitle='Page not found'>
        <div>
          <article>
            <header>
              <h1>Page not found</h1>
            </header>
            <div>
              <p>We were not able to find the page you are looking for. It may have been archived or removed.</p>
              <p>You might find an older snapshot of this page at the <a href='http://archive.org/web/' title='Find on Internet Archive'>Internet Archive</a>.<br /> If you think this page should be here let us know via <a href='mailto:' title='Send us an email'>email</a>.</p>
              <p><Link to='/' title='Visit the homepage'>Visit the homepage</Link></p>
            </div>
          </article>
        </div>
      </App>
    );
  }
}
