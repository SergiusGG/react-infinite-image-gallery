import { useEffect, useState, useRef  } from "react";
import axios from "axios";
import './App.css';

const App = () => {
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page] = useState(1);
  const pageRef = useRef(null);

  


  const getPhotos = () => {
    setIsLoading(true);
    axios
      .get(
        `https://jsonplaceholder.typicode.com/photos?_page=${page}&_limit=15`
      )
      .then((response) => {
        setPhotos([...photos, ...response.data]);
        setIsLoading(false);
      })
    
  };
  useEffect(() => {
    getPhotos();
  }, []);


  const onIntersect = ([entry], observer) => {
    if (entry.isIntersecting && !isLoading) {
      observer.unobserve(entry.target);
      getPhotos();
      observer.observe(pageRef.current);
    }
  };

  useEffect(() => {
    if (!isLoading) {
      const observer = new IntersectionObserver(onIntersect);
      if (pageRef.current) observer.observe(pageRef.current);
      return () => observer && observer.disconnect();
    }
  }, [isLoading]);




  const deleteimg = i => {
    const newPhotos = [...photos];
    newPhotos.splice(i,1);
    setPhotos(newPhotos);
  }

  return (
    <div className="container">
        <div className="row">
        {photos.map((photo, i) => {
              return (
                <div className="column" key={i}>
                  <img
                    src={photo.url}
                    alt={photo.title}
                    onClick={() => deleteimg(i)}
                  />
                </div>
              );
            })}
          
        </div>
        <div ref={pageRef}>{isLoading && "Loading..."}</div>
    </div>
  );
}

export default App;
