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
  const initialValues = { title: '', location: '', howOften: '', lastWateredOn: '' };

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
            <div>
              <label htmlFor="title">
                Title
                <input
                  type="text"
                  name="title"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.title}
                />
              </label>
            </div>
            <div>
              <label htmlFor="location">
                Location
                <input
                  type="text"
                  name="location"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.location}
                />
              </label>
            </div>
            <div>
              <label htmlFor="howOften">
                How Often
                <select
                  name="howOften"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.howOften}
                >
                  <option value="1 week">1 week</option>
                  <option value="2 weeks">2 weeks</option>
                  <option value="3 weeks">3 weeks</option>
                  <option value="4 weeks">4 weeks</option>
                </select>
              </label>
            </div>
            <div>
              <label htmlFor="lastWateredOn">
                Last Watered On
                <input
                  type="date"
                  name="lastWateredOn"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.lastWateredOn}
                />
              </label>
            </div>
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
