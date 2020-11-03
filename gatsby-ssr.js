/* eslint-disable import/no-duplicates */
/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/ssr-apis/
 */

import React from 'react';
import 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import Layout from './src/components/layout';

export { default as wrapRootElement } from './src/redux/ReduxWrapper';

// wrapping with React Fragment here so we can use hooks in Layout
export const wrapPageElement = ({ element }) => {
  return (
    <>
      <Layout>{element}</Layout>
    </>
  );
};
