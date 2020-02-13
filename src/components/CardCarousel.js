import React from 'react';
import { fetchData, getCurrentMediaSize } from '../utils/index';

class CardCarousel extends React.Component {
  state = {
    loading: false,
    error: '',
    activeIndex: 0,
    cardsPerView: 1,
    images: [],
    visibleImages: [],
    updateVisibility: false,
  }

  componentDidMount() {
    this.getImages();
    this.setCardsPerView();

    window.addEventListener('resize', this.setCardsPerView);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.images.length !== this.state.images.length) {
      this.setInitialActiveCard();
    }

    if (this.state.updateVisibility) {
      this.setVisibleCards();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setCardsPerView);
  }

  setInitialActiveCard = () => {
    const { cardsPerView, activeIndex } = this.state;
    const activeImageIndex = Math.floor(cardsPerView / 2);

    if (activeIndex !== activeImageIndex) {
      this.setState({ activeIndex: activeImageIndex, updateVisibility: true });
    } else {
      this.setState({ updateVisibility: true });
    }
  }

  setCardsPerView = () => {
    const currentMediaSize = getCurrentMediaSize();
    if (currentMediaSize === 'small') {
      if (this.state.cardsPerView !== 1) {
        this.setState({ cardsPerView: 1, updateVisibility: true });
      }
    }

    if (currentMediaSize === 'medium') {
      if (this.state.cardsPerView !== 3) {
        this.setState({ cardsPerView: 3, updateVisibility: true });
      }
    }

    if (currentMediaSize === 'large') {
      if (this.state.cardsPerView !== 5) {
        this.setState({ cardsPerView: 5, updateVisibility: true });
      }
    }
  }

  setVisibleCards = () => {
    const { images, cardsPerView, activeIndex, visibleImages } = this.state;
    let tempImages = [...visibleImages];
    const count = images.length;

    switch (cardsPerView) {
      case 5:
        tempImages = images.slice(activeIndex - 2, activeIndex + 3);
        if (activeIndex + 2 > count - 1) {
          tempImages = [...tempImages, ...images.slice(0, cardsPerView % tempImages.length)];
        }

        if (activeIndex >= 0 && activeIndex <= 1) {
          tempImages = [
            ...images.slice(count - 2 + activeIndex), ...images.slice(0, 3 + activeIndex)
          ];
        }
        break;

      case 3:
        tempImages = images.slice(activeIndex - 1, activeIndex + 2);
        if (activeIndex + 1 > count - 1) {
          tempImages = [...tempImages, ...images.slice(0, cardsPerView % tempImages.length)];
        }

        if (activeIndex === 0) {
          tempImages = [...images.slice(count - 1), ...images.slice(0, 2)];
        }
        break;

      default:
        tempImages = [images[activeIndex]];
        break;
    }
    
    this.setState({ visibleImages: tempImages, updateVisibility: false });
  }

  triggerSlide = (ev) => {
    const { images } = this.state;
    let { activeIndex } = this.state;
    const count = images.length;
    const slideType = ev.target.textContent.toLowerCase();

    if (slideType === 'prev') {
      if (activeIndex === 0) {
        this.setState({ activeIndex: count - 1, updateVisibility: true });
      } else {
        this.setState({ activeIndex: activeIndex - 1, updateVisibility: true });
      }
    } else if (slideType === 'next') {
      if (activeIndex === count - 1) {
        this.setState({ activeIndex: 0, updateVisibility: true });
      } else {
        this.setState({ activeIndex: activeIndex + 1, updateVisibility: true });
      }
    }
  }

  getImages = () => {
    fetchData()
      .then((data) => {
        const images = data.hits.map((item, idx) => {
          const newItem = {};
          newItem.id = item.id;
          newItem.url = item.webformatURL;
          newItem.title = `Image ${idx + 1} title`;
          return newItem;
        });
        this.setState({ images: images, loading: false });
      })
      .catch((error) => {
        this.setState({ error: error });
      });
  }

  render() {
    const { loading, error, visibleImages } = this.state;

    return (
      <div className="card-carousel">
        <h2 className="card-carousel__heading">Card Carousel</h2>
        {loading && !error &&
          <p className="card-carousel--pending">Loading images..</p>
        }

        {!loading && !error && visibleImages.length === 0 &&
          <p className="card-carousel--result">No images available.</p>
        }

        {!loading && error &&
          <p className="card-carousel--error">{error}</p>
        }

        {!loading && !error && visibleImages.length > 0 &&
          <React.Fragment>
            <div className="card-carousel-item-list">
              {visibleImages.map((item, idx) => {
                return (
                  <div key={item.id} className="card-carousel-item">
                    <div className="card-carousel-item__image">
                      <img src={item.url} alt={`${idx}`} />
                    </div>
                    <h3 className="card-carousel-item__heading">{item.title}</h3>
                  </div>
                );
              })}
            </div>
            <div className="card-carousel-nav">
              <button
                className="card-carousel-nav__item card-carousel-nav__item--prev"
                onClick={this.triggerSlide}
              >Prev</button>
              <button
                className="card-carousel-nav__item card-carousel-nav__item--next"
                onClick={this.triggerSlide}
              >Next</button>
            </div>
          </React.Fragment>
        }
      </div>
    );
  }
};

export default CardCarousel;
