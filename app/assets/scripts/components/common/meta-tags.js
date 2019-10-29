import React from 'react';
import { withTheme } from 'styled-components';
import { PropTypes as T } from 'prop-types';
import { Helmet } from 'react-helmet';

import { environment, appTitle, baseUrl } from '../../config';

const MetaTags = ({ title, description, theme, children }) => {
  return (
    <Helmet>
      <title>{title}</title>
      {description ? <meta name='description' content={description} /> : null}

      <meta name='theme-color' content={theme.color.primary} />

      {/* Twitter */}
      <meta name='twitter:card' content='summary' />

      {/* Open Graph */}
      <meta property='og:type' content='website' />
      <meta property='og:url' content={baseUrl} />
      <meta property='og:site_name' content={appTitle} />
      <meta property='og:title' content={title} />
      <meta
        property='og:image'
        content={`${baseUrl}/assets/graphics/meta/default-meta-image.png`}
      />
      {description ? (
        <meta property='og:description' content={description} />
      ) : null}

      {/* Additional children */}
      {children}
    </Helmet>
  );
};

if (environment !== 'production') {
  MetaTags.propTypes = {
    title: T.string,
    description: T.string,
    theme: T.object,
    children: T.node
  };
}

export default withTheme(MetaTags);
