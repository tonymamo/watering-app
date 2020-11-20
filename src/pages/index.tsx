import React from 'react';
import { Link } from 'gatsby';
import { useFirestoreConnect, useFirebase } from 'react-redux-firebase';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { FaDizzy, FaSmile } from 'react-icons/fa';

import SEO from '../components/seo';
import { RootState } from '../redux/ducks';

const PlantWrapper = styled.div`
  border: 1px solid #dedede;
  padding: 16px;
  margin-bottom: 16px;
  border-radius: 8px;
  display: flex;
`;

const PlantInfo = styled.div`
  flex: 1;
`;

const PlantImageWrapper = styled.div`
  width: 25%;
  margin-right: 16px;
`;

const PlantImage = styled.img`
  border-radius: 50%;
  margin: 0;
`;

const PlantStatus = styled.div`
  width: 45%;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 4px;
  padding: 16px;
  border: 1px solid;
  color: ${(props: { isWatered: boolean }) => (props.isWatered ? 'green' : 'red')};
  border-color: ${(props: { isWatered: boolean }) => (props.isWatered ? 'green' : 'red')};
  background-color: ${(props: { isWatered: boolean }) => (props.isWatered ? '#89d889' : '#f5abab')};
`;

const IndexPage = () => {
  // const auth = useSelector((state: RootState) => state.firebase.auth);
  const plants = useSelector((state: RootState) => state.firestore.ordered.plants);
  useFirestoreConnect([{ collection: 'plants' }]);

  const firebase = useFirebase();

  const needsWatering = (howOften: string, lastWateredOn: string) => {
    // This functions takes in two parameters, howOften and the lastWateredOn date (as a string)
    // First, we need to know what todays date is, so we create a variable for it
    const todaysDate = new Date();

    // then, we create a new variable using `let`, because we are going to change its value later on
    // if we used a const instead of let, we wouldnt be able to change the variable because it would
    // be a "constant" aka unchangeable variable. We can initialize it as a Date for now so typescript
    // can know what "type" of variable it should be
    let wateringWindowCutoff = new Date();

    // Next, we need to compare our howOften schedule to today, and subtract the appropriate amount
    // of days. For example, if today is Nov 10th and our howOften is 1 week, the latest it should
    // have been watered is Nov 3rd at most, so we update our wateringWindowCutoff to Nov 3rd.
    //
    // We take todaysDate (the variable we created above), temporarily change that variables value
    // using setDate() JS Date method, and set it equal to todays date minus the number of days in
    // our howOften schedule, i.e. 2 weeks is 14 days. Lastly we wrap all of that in a new Date() to
    // convert the output of that to be a Date instead of a number, which setDate() returns
    if (howOften === '1 week') {
      wateringWindowCutoff = new Date(todaysDate.setDate(todaysDate.getDate() - 7));
    } else if (howOften === '2 weeks') {
      wateringWindowCutoff = new Date(todaysDate.setDate(todaysDate.getDate() - 14));
    } else if (howOften === '3 weeks') {
      wateringWindowCutoff = new Date(todaysDate.setDate(todaysDate.getDate() - 21));
    } else if (howOften === '4 weeks') {
      wateringWindowCutoff = new Date(todaysDate.setDate(todaysDate.getDate() - 28));
    }

    // Finally, we can compare our lastWateredOn date to our wateringWindowCutoff. If the lastWateredOn
    // date is before or equal to our wateringWindowCutoff date, then its time to water, so we return
    // a string saying so. Otherwise, if the lastWateredOn time is within the wateringWindowCutoff date
    // and today, it doesn't need to be watered, so we return the second condition in our ternary.
    //
    // Note: by using getTime() on both, it converts both dates to milliseconds, for an easier
    // mathematical comparison. We wrap lastWateredOn in a new Date() because it is a string coming
    // from the database
    return new Date(lastWateredOn).getTime() <= wateringWindowCutoff.getTime();
  };

  const updatePlantStatus = (plant) => {
    firebase
      .firestore()
      .collection('plants')
      .doc(plant.plantId)
      .set({
        ...plant,
        lastWateredOn: new Date().toLocaleDateString(),
      });
  };

  return (
    <>
      <SEO title="Home" />
      <h1>My Plants</h1>
      {plants &&
        plants.length > 0 &&
        plants.map((plant: any) => (
          <PlantWrapper key={plant.title}>
            <PlantImageWrapper>
              <PlantImage src="https://placekitten.com/200" alt={`A ${plant.title} plant`} />
            </PlantImageWrapper>
            <PlantInfo>
              <h2>{plant.title}</h2>
              <p>
                <strong>Location:</strong> {plant.location}
              </p>
              <p>
                <strong>How Often:</strong> {plant.howOften}
              </p>
            </PlantInfo>
            <PlantStatus isWatered={!needsWatering(plant.howOften, plant.lastWateredOn)}>
              {needsWatering(plant.howOften, plant.lastWateredOn) ? (
                <FaDizzy size={64} />
              ) : (
                <FaSmile size={64} />
              )}
              <p>
                <strong>Last Watered:</strong> {plant.lastWateredOn}
              </p>
              <p>
                <strong>Needs Watering:</strong>{' '}
                {needsWatering(plant.howOften, plant.lastWateredOn)
                  ? 'Yes, water me now!'
                  : 'Nope, all good right now'}
              </p>
              {needsWatering(plant.howOften, plant.lastWateredOn) && (
                <button type="button" onClick={() => updatePlantStatus(plant)}>
                  Just Watered
                </button>
              )}
            </PlantStatus>
          </PlantWrapper>
        ))}
      <Link to="/new/">Go to New page</Link> <br />
    </>
  );
};

export default IndexPage;
