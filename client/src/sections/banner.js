/** @jsx jsx */
import { jsx, Box, Container } from 'theme-ui';
import SignupForm from 'components/signup-form';
import Image from 'components/image';
import illustration from 'assets/images/—Pngtree—cryptocurrency exchange illustration concept _4853436.png';

const Banner = () => { 
  return (
    <Box as="section" id="home" sx={styles.section}>
      <Container>
        <Box sx={styles.contentWrapper}>
          <SignupForm />
          <Box as="figure" sx={styles.illustration}>
            <Image
              src={illustration}
              width="836"
              height="458"
              alt="illustration"
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Banner;

const styles = {
  section: {
    background: `#fff`,
    position: 'relative',
    zIndex: 0,
    pt: [17, null, null, 19, 21, 23],
    pb: [8, null, null, 10, null, null, 10],
    minHeight: [null, null, null, null, null, '100vh'],
  },
  contentWrapper: {
    gap: [12, null, null, 14, 12],
    display: 'grid',
    gridTemplateColumns: ['1fr', null, null, null, '385px 1fr', '470px 1fr'],
    alignItems: 'center',
  },
  illustration: {
    marginTop: '-100px',
    display: 'flex',
    alignItems: 'center',
  },
};
