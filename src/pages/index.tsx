import React from 'react';
import { Link } from 'gatsby';
import { useFirestoreConnect } from 'react-redux-firebase';
import { useSelector } from 'react-redux';

import SEO from '../components/seo';
import { RootState } from '../redux/ducks';

const IndexPage = () => {
  // const auth = useSelector((state: RootState) => state.firebase.auth);
  const plants = useSelector((state: RootState) => state.firestore.ordered.plants);
  useFirestoreConnect([{ collection: 'plants' }]);
  return (
    <>
      <SEO title="Home" />
      <h1>My Plants</h1>
      {plants &&
        plants.length > 0 &&
        plants.map((plant) => (
          <p key={plant.title}>
            {plant.title} {plant.location}
          </p>
        ))}
      <Link to="/new/">Go to New page</Link> <br />
    </>
  );
};

export default IndexPage;
