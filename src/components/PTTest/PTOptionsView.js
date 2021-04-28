import React, { useState } from 'react';
import { Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import HTML from 'react-native-render-html';
import PropTypes from 'prop-types';
import Colors from '../../theme/colors';
import { STANDARD_SCREEN_SIZE } from '../../utils/constants';
import { CustomCheckBox } from '..';
import styles from './ptOption.style';

const PTOptionsView = (props) => {
  const {
    submission,
    answers,
    handleMarkAnswer,
    handleNext,
    handlePrevious,
    handleSubmit,
    currentQuestion,
    maxQuestion,
    question,
  } = props;

  const [optionOne, setOptionOne] = useState(false);
  const [optionTwo, setOptionTwo] = useState(false);
  const [optionThree, setOptionThree] = useState(false);
  const [optionFour, setOptionFour] = useState(false);

  React.useEffect(() => {
    setOptionOne(answers[0].id === submission);
    setOptionTwo(answers[1].id === submission);
    setOptionThree(answers[2].id === submission);
    setOptionFour(answers[3].id === submission);
  }, [answers]);

  const contentWidth = useWindowDimensions().width;

  return (
    <View>
      <View style={styles.questionView}>
        <Text style={styles.questionHeadingText}>
          Question {currentQuestion} Of {maxQuestion}
        </Text>
        <View style={styles.questionContainer}>
          <HTML
            tagsStyles={{ p: { color: Colors.black, fontSize: RFValue(22, STANDARD_SCREEN_SIZE) } }}
            source={{ html: question }}
            contentWidth={contentWidth}
          />
        </View>

        <TouchableOpacity
          onPress={() => {
            handleMarkAnswer(answers[0]);
            setOptionOne(!optionOne);
            setOptionTwo(false);
            setOptionThree(false);
            setOptionFour(false);
          }}
          style={styles.optionView}
          activeOpacity={0.8}>
          <CustomCheckBox
            enabled={optionOne}
            submitFunction={() => {
              handleMarkAnswer(answers[0]);
              setOptionOne(!optionOne);
              setOptionTwo(false);
              setOptionThree(false);
              setOptionFour(false);
            }}
          />
          <HTML
            tagsStyles={{ p: { color: Colors.black, fontSize: RFValue(18, STANDARD_SCREEN_SIZE) } }}
            containerStyle={styles.optionText}
            source={{ html: answers[0].text }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            handleMarkAnswer(answers[1]);
            setOptionOne(false);
            setOptionTwo(!optionTwo);
            setOptionThree(false);
            setOptionFour(false);
          }}
          style={styles.optionView}
          activeOpacity={0.8}>
          <CustomCheckBox
            enabled={optionTwo}
            submitFunction={() => {
              handleMarkAnswer(answers[1]);
              setOptionOne(false);
              setOptionTwo(!optionTwo);
              setOptionThree(false);
              setOptionFour(false);
            }}
          />
          <HTML
            tagsStyles={{ p: { color: Colors.black, fontSize: RFValue(18, STANDARD_SCREEN_SIZE) } }}
            containerStyle={styles.optionText}
            source={{ html: answers[1].text }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            handleMarkAnswer(answers[2]);
            setOptionOne(false);
            setOptionTwo(false);
            setOptionThree(!optionThree);
            setOptionFour(false);
          }}
          style={styles.optionView}
          activeOpacity={0.8}>
          <CustomCheckBox
            enabled={optionThree}
            submitFunction={() => {
              handleMarkAnswer(answers[2]);
              setOptionOne(false);
              setOptionTwo(false);
              setOptionThree(!optionThree);
              setOptionFour(false);
            }}
          />
          <HTML
            tagsStyles={{ p: { color: Colors.black, fontSize: RFValue(18, STANDARD_SCREEN_SIZE) } }}
            containerStyle={styles.optionText}
            source={{ html: answers[0].text }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            handleMarkAnswer(answers[3]);
            setOptionOne(false);
            setOptionTwo(false);
            setOptionThree(false);
            setOptionFour(!optionFour);
          }}
          style={styles.optionView}
          activeOpacity={0.8}>
          <CustomCheckBox
            enabled={optionFour}
            submitFunction={() => {
              handleMarkAnswer(answers[3]);
              setOptionOne(false);
              setOptionTwo(false);
              setOptionThree(false);
              setOptionFour(!optionFour);
            }}
          />
          <HTML
            tagsStyles={{ p: { color: Colors.black, fontSize: RFValue(18, STANDARD_SCREEN_SIZE) } }}
            containerStyle={styles.optionText}
            source={{ html: answers[0].text }}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.buttonView}>
        <TouchableOpacity
          hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
          activeOpacity={1}
          onPress={() => handlePrevious()}>
          <Text style={styles.buttonLeft}>Previous</Text>
        </TouchableOpacity>
        {currentQuestion === maxQuestion ? (
          <TouchableOpacity
            activeOpacity={1}
            hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
            onPress={() => handleSubmit()}>
            <Text style={styles.buttonRight}>Submit</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            activeOpacity={1}
            hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
            onPress={() => {
              setOptionOne(false);
              setOptionTwo(false);
              setOptionThree(false);
              setOptionFour(false);
              handleNext();
            }}>
            <Text style={styles.buttonRight}>Next</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

PTOptionsView.propTypes = {
  handleNext: PropTypes.func,
  handleMarkAnswer: PropTypes.func,
  handlePrevious: PropTypes.func,
  handleSubmit: PropTypes.func,
  question: PropTypes.string,
  maxQuestion: PropTypes.number,
  currentQuestion: PropTypes.number,
  submission: PropTypes.number,
  answers: PropTypes.array,
};
PTOptionsView.defaultProps = {
  handleNext: null,
  handleMarkAnswer: null,
  handlePrevious: null,
  handleSubmit: null,
  question: null,
  maxQuestion: 0,
  currentQuestion: 0,
  submission: 0,
  answers: [],
};

export default PTOptionsView;
