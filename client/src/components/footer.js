/** @jsx jsx */
import { jsx, Flex, Box, Text, Container } from 'theme-ui';
import { rgba } from 'polished';
import { Link } from 'components/link';
import Logo from 'components/logo';

const menuItems = [
  {
    path: '#home',
    label: 'Home',
  },
  {
    path: '#features',
    label: 'Features',
  },
  {
    path: '#demo',
    label: 'Demo',
  },
];

export default function Footer() {
  return (
    <Box as="footer" sx={styles.footer}>
      <Container>
        <Flex sx={styles.footerInner}>
          <Flex sx={styles.copyright}>
            <Logo sx={styles.logo} />
          </Flex>
          <Flex as="ul" sx={styles.footerNav}>
            {menuItems?.map((item, index) => (
              <li key={index}>
                <Link path={item?.path}>{item?.label}</Link>
              </li>
            ))}
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
}

const styles = {
  footer: {
    backgroundColor: '#fff',
    pt: [6],
    pb: [6],
  },
  footerInner: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: ['column', null, null, null, 'row'],
  },
  copyright: {
    alignItems: 'center',
    flexDirection: ['column', null, null, null, 'row'],
    span: {
      color: rgba('black', 0.7),
      fontSize: 1,
      lineHeight: '18px',
      mt: [3, null, null, null, 0],
      ml: [0, null, null, null, '15px'],
      textAlign: ['center', null, null, 'left'],
    },
  },
  logo: {},
  footerNav: {
    listStyle: 'none',
    // flexDirection: ['column', null, null, null, 'row'],
    m: ['25px 0 0', null, null, null, 0],
    p: 0,
    li: {
      '+ li': {
        ml: [3, null, null, null, 3, 4],
      },
      a: {
        color: '#000',
        cursor: 'pointer',
        textDecoration: 'none',
        fontSize: [1, null, null, 2, 1, 2],
      },
    },
  },
};
