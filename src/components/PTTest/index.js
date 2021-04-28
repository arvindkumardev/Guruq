import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';
import { RfH } from '../../utils/helpers';
import PTOptionsView from './PTOptionsView';
import styles from './style';

const PTTestView = (props) => {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [counter, setCounter] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState();
  const [endDateTime] = useState(moment().add(30, 'minutes').valueOf());

  let timer;
  const totalTime = 30 * 60;
  const { ptQuestions, ptDetails, offeringId, handleSubmit } = props;

  const maxQuestion = ptQuestions.length;

  const temp = [];

  // eslint-disable-next-line array-callback-return
  ptQuestions.map((question) => {
    temp.push({ questionId: question.id, answers: [] });
  });
  const [response, setResponse] = useState({ tutorOfferingId: offeringId, tutorPtId: ptDetails.id, submissions: temp });
  const handleNext = () => {
    // maniuplate the submission
    if (currentQuestion < maxQuestion) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };
  const handlePrevious = () => {
    if (currentQuestion !== 1) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };
  const onSubmit = () => {
    clearInterval(timer);

    const checkPTDto = {
      tutorOfferingId: parseFloat(response.tutorOfferingId),
      tutorPtId: parseFloat(response.tutorPtId),
      submissions: response.submissions,
      timeTaken: totalTime - counter,
    };

    handleSubmit(checkPTDto);
  };

  const getTime = () => {
    if (endDateTime > 0) {
      const value = parseInt((endDateTime - moment().valueOf()) / 1000, 10);

      if (value === 0) {
        onSubmit();
        return 0.0;
      }
      if (parseInt((endDateTime - moment().valueOf()) / 1000, 10) > 0) {
        return (endDateTime - moment().valueOf()) / 1000;
      }
    }
    return 0.0;
  };
  const getTimeString = () => {
    if (endDateTime > 0) {
      const t = getTime();
      setTimeRemaining(`${Math.floor(t / 60)}:${Math.floor(t % 60)}`);
    }
  };

  // var timer ;
  useEffect(() => {
    timer = setInterval(function interval() {
      setCounter(counter + 1);
      getTimeString();
    }, 1000);

    return function cleanup() {
      clearInterval(timer);
    };
  }, []);

  const handleMarkAnswer = (answer) => {
    const temp = response;
    if (temp.submissions[currentQuestion - 1].answers.length > 0) {
      if (temp.submissions[currentQuestion - 1].answers[0] === answer.id) {
        temp.submissions[currentQuestion - 1].answers.pop();
      } else {
        temp.submissions[currentQuestion - 1].answers[0] = answer.id;
      }
    } else {
      temp.submissions[currentQuestion - 1].answers[0] = answer.id;
    }
    setResponse(temp);
    // console.log('Response is ', JSON.stringify(response));
  };
  const getCurrentSubmission = () => {
    if (response.submissions[currentQuestion - 1].answers.length > 0) {
      return response.submissions[currentQuestion - 1].answers[0];
    }
    return null;
  };

  return (
    <>
      <ScrollView
        style={{ marginBottom: RfH(16) }}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        <View style={styles.mainView}>
          <View>
            <Text style={styles.headingtext}>Total Questions</Text>
            <Text style={styles.questionText}>{maxQuestion}</Text>
          </View>
          <View>
            <Text style={styles.headingtext}>Time Remaining</Text>
            <Text style={styles.timetext}>{timeRemaining}</Text>
          </View>
        </View>
        <PTOptionsView
          question={ptQuestions[currentQuestion - 1].question}
          handleNext={handleNext}
          currentQuestion={currentQuestion}
          maxQuestion={maxQuestion}
          handlePrevious={handlePrevious}
          handleSubmit={onSubmit}
          submission={getCurrentSubmission()}
          handleMarkAnswer={handleMarkAnswer}
          answers={ptQuestions[currentQuestion - 1].answers}
        />
      </ScrollView>
    </>
  );
};

PTTestView.propTypes = {
  ptQuestions: PropTypes.array,
  ptDetails: PropTypes.object,
  offeringId: PropTypes.number,
  handleSubmit: PropTypes.func,
};
PTTestView.defaultProps = {
  ptQuestions: [],
  ptDetails: {},
  offeringId: 0,
  handleSubmit: null,
};

export default PTTestView;
