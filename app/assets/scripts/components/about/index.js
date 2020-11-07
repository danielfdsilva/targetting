import React, { Component } from 'react';

import App from '../common/app';
import Constrainer from '../../styles/constrainer';
import Prose from '../../styles/type/prose';

class About extends Component {
  render () {
    return (
      <App pageTitle='About'>
        <Constrainer>
          <Prose>
            <img
              src='/assets/graphics/layout/targetting_colored.svg'
              alt='Targetting logotype'
              width='96'
              height='96'
            />
            <p>Targetting is an archery scoring application.</p>
            <p>Developed by <a href='http://danielfdsilva.com' title="Visit developer's website.">Daniel da Silva</a>. Code is Open Source (MIT license) and available on <a href='https://github.com/danielfdsilva/targetting' title='Visit application github repository'>Github</a>.</p>
          </Prose>
        </Constrainer>
      </App>
    );
  }
}

export default About;
