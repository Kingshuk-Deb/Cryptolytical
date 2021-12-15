/** @jsx jsx */
import { jsx, Box, Container } from 'theme-ui';
import Masonry from 'react-masonry-component';
import SectionHeading from 'components/section-heading';
import NewsPost from 'components/cards/news-post';
import thumb1 from 'assets/images/news/pexels-alesia-kozik-6770775.jpeg';
import thumb2 from 'assets/images/news/pexels-david-mcbee-730564.jpeg';
import thumb3 from 'assets/images/news/pexels-olya-kobruseva-8358040.jpeg';
import thumb4 from 'assets/images/news/pexels-pratikxox-4025825.jpeg';
import { useState } from 'react';

const masonryOptions = { originTop: true };

const News = () => {
  const [data, setData] = useState([]);
  try {
    fetch('http://cryptolytical.herokuapp.com/api/cryptonews?limit=5', {
      method: "GET",
      headers: {
        "Authorization": "Bearer Token",
      },
    }).then(function(response) {
      return response.json();
    }).then(function(newsData) {
      newsData.result.map((news) => {
        if(news.id === 1 || news.id === 4) news.showDescription = true;
        else news.showDescription = false;
        if(news.id === 1) news.thumbnail = thumb1;
        if(news.id === 2) news.thumbnail = null;
        if(news.id === 3) news.thumbnail = thumb3;
        if(news.id === 4) news.thumbnail = thumb2;
        if(news.id === 5) news.thumbnail = thumb4;
      })
      setData(newsData.result);
    })
  } catch (e) {
    console.error(e);
    console.log("there as an error");
  }

  return (
    <Box as="section" sx={styles.section}>
      <Container>
        <SectionHeading
          sx={styles.heading}
          slogan="Latest newsfeed"
          title="Explore what's happening in the Crypto World"
        />
        <Masonry options={masonryOptions} sx={styles.postContainer}>
          {data?.map((post) => (
            <NewsPost key={post.id} post={post} />
          ))}
        </Masonry>
      </Container>
    </Box>
  );
};

export default News;

const styles = {
  section: {
    pt: [6, null, null, 9, null, 13],
    pb: [8, null, null, 9, null, 17],
    position: 'relative',
  },
  heading: {
    mb: [6, null, null, 9],
  },
};
