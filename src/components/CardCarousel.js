import React from 'react';
import { fetchData } from '../utils/index';

class CardCarousel extends React.Component {
  state = {
    loading: false,
    error: '',
    activeIndex: 0,
    images: [],
  }

  componentDidMount() {
    this.getImages();
  }

  componentDidUpdate() {
    console.log(this.state);
  }

  getImages = () => {
    fetchData()
      .then((data) => {
        const images = data.hits.map(item => {
          const newItem = {};
          newItem.id = item.id;
          newItem.url = item.webformatURL;
          return newItem;
        });
        this.setState({ images: images, loading: false });
      })
      .catch((error) => {
        this.setState({ error: error });
      });
  }

  render() {
    const { loading, error, images } = this.state;

    return (
      <div className="card-carousel">
        {loading && !error &&
          <p className="card-carousel--pending">Loading images..</p>
        }

        {!loading && !error && images.length === 0 &&
          <p className="card-carousel--result">No images available.</p>
        }

        {!loading && error &&
          <p className="card-carousel--error">{error}</p>
        }

        {!loading && !error && images.length > 0 &&
          images.map((item, idx) => {
            return (
              <div key={item.id}>
                <img src={item.url} alt={`${idx}`} />
                <h3>{`Image ${idx + 1} title`}</h3>
              </div>
            );
          })
        }
      </div>
    );
  }
};

export default CardCarousel;
