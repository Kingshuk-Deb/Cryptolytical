import React from 'react';
import { ThemeProvider } from 'theme-ui';
import theme from 'theme';
import SEO from 'components/seo';
import Layout from 'components/layout';
import Banner from 'sections/banner';
import UltimateFeatures from 'sections/ultimate-features';
import SubscribeUs from 'sections/subscribe-us';
import IntroVideo from 'components/intro-video';

export default function IndexPage() {
  return (
    <ThemeProvider theme={theme}>
      <Layout>
        <SEO
          title="Cryptolytical - Free Crypto API"
          description="The Cryptocurrency API you need! A collection of 200+ latest news articles and 200+ Crypto Data with Sentiment Analysis"
        />
        <Banner />
        <UltimateFeatures />
        <IntroVideo />
        <SubscribeUs />
      </Layout>
    </ThemeProvider>
  );
}
