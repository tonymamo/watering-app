import React from 'react';
import { Link } from 'gatsby';
import { useFirestoreConnect, useFirebase } from 'react-redux-firebase';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  FaDizzy,
  FaFrown,
  FaFrownOpen,
  FaSadCry,
  FaSadTear,
  FaSeedling,
  FaSmile,
  FaTint,
} from 'react-icons/fa';
import { addDays, isBefore, isAfter } from 'date-fns';

import SEO from '../components/seo';
import { RootState } from '../redux/ducks';

const PlantWrapper = styled.div`
  padding: 16px;
  margin-bottom: 16px;
  border-radius: 8px;
  display: flex;
  border: 4px solid rgba(0, 0, 0, 0.25);
  color: ${(props: { isWatered: string | undefined }) => (!props.isWatered ? 'green' : 'white')};
  background-color: ${(props: { isWatered: string | undefined }) =>
    !props.isWatered ? '#89d889' : props.isWatered};
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
  border: 4px solid rgba(0, 0, 0, 0.25);
  margin: 0;
`;

const PlantStatus = styled.div`
  width: 45%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  border-radius: 4px;
  padding: 16px;
`;

const StyledButton = styled.button`
  -webkit-appearance: button;
  cursor: pointer;
  position: relative;
  display: inline-flex;
  font-size: 1em;
  justify-content: center;
  align-items: center;
  white-space: nowrap;
  vertical-align: middle;
  touch-action: manipulation;
  cursor: pointer;
  user-select: none;
  line-height: 1.5;
  padding: 8px 24px;
  text-decoration: none;
  background-color: green;
  color: white;
  border: 4px solid rgba(0, 0, 0, 0.25);
  border-radius: 24px;
  &:hover,
  &:focus {
    outline: none;
    filter: brightness(0.85);
  }
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

    // another variable using `let`, because in our if statement below we are going to overwrite the
    // values each time. We will track 4 different periods for how late the watering is, using a
    // percentage as a key. Note that normally we wouldn't use numbers and % sign in a key, but we
    // have a workaround later to account for that. So just wrap it as a string for now
    let howLate = {
      '25%': new Date(),
      '50%': new Date(),
      '75%': new Date(),
      '100%': new Date(),
    };

    // Next, we need to compare our howOften schedule to today, and subtract the appropriate amount
    // of days. For example, if today is Nov 10th and our howOften is 1 week, the latest it should
    // have been watered is Nov 3rd at most, so we update our wateringWindowCutoff to Nov 3rd.
    //
    // We take todaysDate (the variable we created above), temporarily change that variables value
    // using setDate() JS Date method, and set it equal to todays date minus the number of days in
    // our howOften schedule, i.e. 2 weeks is 14 days. Lastly we wrap all of that in a new Date() to
    // convert the output of that to be a Date instead of a number, which setDate() returns
    if (howOften === '1 week') {
      // create a new variable, thats scoped to only work within this if statement.
      const adjustedCutoffdate = new Date(todaysDate.setDate(todaysDate.getDate() - 7));
      // now, assign that variable we just made to wateringWindowCutoff, a more "global" variable
      // that exists outside of this if statement. If we didn't do this, and used wateringWindowCutoff
      // in the howLate below, it would actually use the value from line 65 for wateringWindowCutoff, not
      // what we just set it to in the line above
      wateringWindowCutoff = adjustedCutoffdate;

      // use adjustedCutoffdate instead of wateringWindowCutoff; just because these lines come after line 93
      // doesnt guarantee that the wateringWindowCutoff variable will be updated when we use it in the following few lines
      howLate = {
        '25%': addDays(new Date(adjustedCutoffdate), -(7 * 0.25)),
        '50%': addDays(new Date(adjustedCutoffdate), -(7 * 0.5)),
        '75%': addDays(new Date(adjustedCutoffdate), -(7 * 0.75)),
        '100%': addDays(new Date(adjustedCutoffdate), -7),
      };
    } else if (howOften === '2 weeks') {
      // repeat for each if statement, creating a new scoped variable of the same name
      const adjustedCutoffdate = new Date(todaysDate.setDate(todaysDate.getDate() - 14));
      wateringWindowCutoff = adjustedCutoffdate;
      howLate = {
        '25%': addDays(new Date(adjustedCutoffdate), -(14 * 0.25)),
        '50%': addDays(new Date(adjustedCutoffdate), -(14 * 0.5)),
        '75%': addDays(new Date(adjustedCutoffdate), -(14 * 0.75)),
        '100%': addDays(new Date(adjustedCutoffdate), -14),
      };
    } else if (howOften === '3 weeks') {
      const adjustedCutoffdate = new Date(todaysDate.setDate(todaysDate.getDate() - 21));
      wateringWindowCutoff = adjustedCutoffdate;
      howLate = {
        '25%': addDays(new Date(adjustedCutoffdate), -(21 * 0.25)),
        '50%': addDays(new Date(adjustedCutoffdate), -(21 * 0.5)),
        '75%': addDays(new Date(adjustedCutoffdate), -(21 * 0.75)),
        '100%': addDays(new Date(adjustedCutoffdate), -21),
      };
    } else if (howOften === '4 weeks') {
      const adjustedCutoffdate = new Date(todaysDate.setDate(todaysDate.getDate() - 28));
      wateringWindowCutoff = adjustedCutoffdate;
      howLate = {
        '25%': addDays(new Date(adjustedCutoffdate), -(28 * 0.25)),
        '50%': addDays(new Date(adjustedCutoffdate), -(28 * 0.5)),
        '75%': addDays(new Date(adjustedCutoffdate), -(28 * 0.75)),
        '100%': addDays(new Date(adjustedCutoffdate), -28),
      };
    }

    // Finally, we can compare our lastWateredOn date to our wateringWindowCutoff. If the lastWateredOn
    // date is before or equal to our wateringWindowCutoff date, then its time to water, so we return
    // a string saying so. Otherwise, if the lastWateredOn time is within the wateringWindowCutoff date
    // and today, it doesn't need to be watered, so we return the second condition in our ternary.
    //
    // Note: by using getTime() on both, it converts both dates to milliseconds, for an easier
    // mathematical comparison. We wrap lastWateredOn in a new Date() because it is a string coming
    // from the database
    // return new Date(lastWateredOn).getTime() <= wateringWindowCutoff.getTime();

    // if its watered, return undefined, meaning it doesnt need watering
    if (new Date(lastWateredOn).getTime() >= wateringWindowCutoff.getTime()) {
      return undefined;
    }

    // quick not on "Dot Notation" vs "Bracket Notation":
    // since we are using numbers and % signs in our object keys (of howLate variable)
    // we need to use bracket notation, otherwise our editor (and the code) would fail to work
    // because it doesnt understand something like howLate.25%
    //
    // howLate.level1 <= dot Notification, if key is a string that starts with letters, doesnt have any special symbols
    // howLate['level1'] <= bracket notation, using same key as live above
    // howLate['25%'] <= bracket notation, but using numbers and % symbol which would normally confuse editor

    // between 0 and 25% late
    if (isBefore(howLate['25%'], new Date(lastWateredOn))) {
      return 'goldenrod';
    }
    // between 25 and 50% late
    if (
      isAfter(howLate['25%'], new Date(lastWateredOn)) &&
      isBefore(howLate['50%'], new Date(lastWateredOn))
    ) {
      return 'darkorange';
    }
    // between 50% and 75% late
    if (
      isAfter(howLate['50%'], new Date(lastWateredOn)) &&
      isBefore(howLate['75%'], new Date(lastWateredOn))
    ) {
      return 'orangered';
    }
    // between 75% and 100% late
    if (
      isAfter(howLate['75%'], new Date(lastWateredOn)) &&
      isBefore(howLate['100%'], new Date(lastWateredOn))
    ) {
      return 'firebrick';
    }
    // more than 100% late
    if (isAfter(howLate['100%'], new Date(lastWateredOn))) {
      return 'black';
    }

    // lastly, if somehow none of the above conditions are met, just return undefined
    return undefined;
  };

  const updatePlantStatus = (plant: { plantId: string; lastWateredOn: string }) => {
    firebase
      .firestore()
      .collection('plants')
      .doc(plant.plantId)
      .set({
        ...plant,
        lastWateredOn: new Date().toLocaleDateString(),
      });
  };

  const renderIcon = (status: string | undefined) => {
    if (status === 'goldenrod') {
      return <FaFrown size={64} />;
    }
    if (status === 'darkorange') {
      return <FaFrownOpen size={64} />;
    }
    if (status === 'orangered') {
      return <FaSadTear size={64} />;
    }
    if (status === 'firebrick') {
      return <FaSadCry size={64} />;
    }
    if (status === 'black') {
      return <FaDizzy size={64} />;
    }
    return <FaSmile size={64} />;
  };

  return (
    <>
      <SEO title="Home" />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>My Plants</h1>
        <StyledButton as={Link} to="/new">
          Add New Plant
        </StyledButton>
      </div>
      {plants &&
        plants.length > 0 &&
        plants.map((plant: any) => (
          <PlantWrapper
            key={plant.title}
            isWatered={needsWatering(plant.howOften, plant.lastWateredOn)}
          >
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
            <PlantStatus>
              <p style={{ textAlign: 'center', margin: 0 }}>
                {renderIcon(needsWatering(plant.howOften, plant.lastWateredOn))}
                <br />
                <strong>Last Watered:</strong> {plant.lastWateredOn}
              </p>
              {needsWatering(plant.howOften, plant.lastWateredOn) && (
                <StyledButton type="button" onClick={() => updatePlantStatus(plant)}>
                  <FaTint />
                  {'  '}Water Me{'  '}
                  <FaSeedling />
                </StyledButton>
              )}
            </PlantStatus>
          </PlantWrapper>
        ))}
    </>
  );
};

export default IndexPage;
