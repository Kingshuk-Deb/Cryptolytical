/** @jsx jsx */
import { jsx, Box, Container } from 'theme-ui';
import SectionHeading from 'components/section-heading2';
import UltimateFeature from 'components/cards/ultimate-feature';

import a200 from 'assets/images/icons/a200.png';
import news from 'assets/images/icons/news.png';
import smile from 'assets/images/icons/smile.png';
import filter from 'assets/images/icons/filter.png';
import CoreFeature from 'components/core-feature';
import News from './news';
import CtaThree from './cta-three';

const data = [
  {
    id: 1,
    icon: a200,
    title: 'Cryptocurrencies',
    description: 'Get Realtime Data of 200 Cryptocurrencies.',
  },
  {
    id: 2,
    icon: news,
    title: 'Cryptocurrency News',
    description: '200+ latest news articles with ample information.',
  },
  {
    id: 3,
    icon: smile,
    title: 'Sentiment Analysis',
    description: 'Sentiment Analysis from 1000+ tweets. AFFIN-111 Algorithm at play here!',
  },
  {
    id: 4,
    icon: filter,
    title: 'Filtered Data',
    description: `Get Filtered Data for customised price queries and cryptos initials.`,
  },
];

const UltimateFeatures = () => {
  return (
    <>
      <div id="features" sx={styles.box}>
        <Box as="section" variant="section.ultimateFeature">
          <Container>
            <SectionHeading
              sx={styles.heading}
              title="What Do We Offer?"
              description="Get all the data you need for building your perfect cryptocurrency app at one place! Read the documentation on Github. Feel free to contribute!"
              />
            <Box sx={styles.features}>
              {data?.map((item) => (
                <UltimateFeature key={item.id} data={item} />
                ))}
            </Box>
          </Container>
        </Box>
        <CoreFeature />
        <News />
        <CtaThree />
      </div>
    </>
  );
};

export default UltimateFeatures;

const styles = {
  box: {
    backgroundColor: '#fff !important'
  },
  heading: {
    marginBottom: [60, 60, 60, 80],
  },
  features: {
    gap: ['35px 60px', 60, 60, 40, 30, 60],
    display: ['grid', 'grid'],
    gridTemplateColumns: [
      'repeat(1, 1fr)',
      'repeat(1, 1fr)',
      'repeat(1, 1fr)',
      'repeat(2, 1fr)',
      'repeat(4, 1fr)',
    ],
  },
};
