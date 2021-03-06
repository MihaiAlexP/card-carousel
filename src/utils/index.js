const ROOT_URL = 'https://pixabay.com/api/';
const API_KEY = '9656065-a4094594c34f9ac14c7fc4c39';
const PER_PAGE = 6;
const QUERY = 'beautiful+landscape';
const IMAGE_TYPE = 'photo';
const ORIENTATION = 'vertical';
const URL = `${ROOT_URL}?key=${API_KEY}` +
  `&per_page=${PER_PAGE}&q=${QUERY}&image_type=${IMAGE_TYPE}&orientation=${ORIENTATION}`;

export const fetchData = async (url = URL) => {
  const response = await fetch(url);
  return await response.json();
};

export const getCurrentMediaSize = () => {
  if (window.matchMedia('(max-width: 767px)').matches) {
    return 'small';
  }

  if (window.matchMedia('(min-width: 768px) and (max-width: 1280px)').matches) {
    return 'medium';
  }
  
  if (window.matchMedia('(min-width: 1281px)').matches) {
    return 'large';
  }

  return 'small';
};
