import React from 'react';
import { navigate, Link } from 'gatsby';
import { Formik } from 'formik';
import { useFirebase } from 'react-redux-firebase';
import { useSelector } from 'react-redux';

import SEO from '../components/seo';
import { RootState } from '../redux/ducks';

const New = () => {
  // const auth = useSelector((state: RootState) => state.firebase.auth);
  const firebase = useFirebase();
  const initialValues = { title: '', location: '' };

  return (
    <>
      <SEO title="New" />
      <h1>New Item</h1>
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => {
          firebase
            .firestore()
            .collection('plants')
            .add(values)
            .then((docRef) => {
              docRef.update({
                plantId: docRef.id,
                created: new Date(),
              });
              navigate('/');
            })
            .catch((err) => {
              console.log(err);
            });
        }}
      >
        {({
          values,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          /* and other goodies */
        }) => (
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="title"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.title}
            />
            <input
              type="text"
              name="location"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.location}
            />

            <button type="submit" disabled={isSubmitting}>
              Save
            </button>
          </form>
        )}
      </Formik>
      <Link to="/">Go to home</Link> <br />
    </>
  );
};

export default New;
