import React, { useRef, useState } from 'react';
import { CheckBox, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import HTML from 'react-native-render-html';
import Colors from '../../theme/colors';
import { STANDARD_SCREEN_SIZE } from '../../utils/constants';

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
  const optionOneRef = useRef(null);
  const optionTwoRef = useRef(null);
  const optionThreeRef = useRef(null);
  const optionFourRef = useRef(null);
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
          style={styles.optionView}
          activeOpacity={1}
          onPress={() => {
            optionOneRef.current._internalFiberInstanceHandleDEV.memoizedProps.onValueChange();
          }}>
          <CheckBox
            ref={optionOneRef}
            value={optionOne}
            tintColors={{ true: '#005CC8', false: 'black' }}
            onValueChange={() => {
              handleMarkAnswer(answers[0]);
              setOptionOne(!optionOne);
              setOptionTwo(false);
              setOptionThree(false);
              setOptionFour(false);
            }}
            style={styles.checkboxView}
          />

          <HTML
            tagsStyles={{ p: { color: Colors.black, fontSize: RFValue(18, STANDARD_SCREEN_SIZE) } }}
            containerStyle={styles.optionText}
            source={{ html: answers[0].text }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.optionView}
          activeOpacity={1}
          onPress={() => {
            optionTwoRef.current._internalFiberInstanceHandleDEV.memoizedProps.onValueChange();
          }}>
          <CheckBox
            ref={optionTwoRef}
            value={optionTwo}
            tintColors={{ true: '#005CC8', false: 'black' }}
            onValueChange={() => {
              handleMarkAnswer(answers[1]);
              setOptionOne(false);
              setOptionTwo(!optionTwo);
              setOptionThree(false);
              setOptionFour(false);
            }}
            style={styles.checkboxView}
          />

          <HTML
            tagsStyles={{ p: { color: Colors.black, fontSize: RFValue(18, STANDARD_SCREEN_SIZE) } }}
            containerStyle={styles.optionText}
            source={{ html: answers[1].text }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.optionView}
          activeOpacity={1}
          onPress={() => {
            optionThreeRef.current._internalFiberInstanceHandleDEV.memoizedProps.onValueChange();
          }}>
          <CheckBox
            ref={optionThreeRef}
            tintColors={{ true: '#005CC8', false: 'black' }}
            value={optionThree}
            onValueChange={() => {
              handleMarkAnswer(answers[2]);
              setOptionOne(false);
              setOptionTwo(false);
              setOptionThree(!optionThree);
              setOptionFour(false);
            }}
            style={styles.checkboxView}
          />

          <HTML
            tagsStyles={{ p: { color: Colors.black, fontSize: RFValue(18, STANDARD_SCREEN_SIZE) } }}
            containerStyle={styles.optionText}
            source={{ html: answers[2].text }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.optionView}
          activeOpacity={1}
          onPress={() => {
            optionFourRef.current._internalFiberInstanceHandleDEV.memoizedProps.onValueChange();
          }}>
          <CheckBox
            ref={optionFourRef}
            tintColors={{ true: '#005CC8', false: 'black' }}
            value={optionFour}
            onValueChange={() => {
              handleMarkAnswer(answers[3]);
              setOptionOne(false);
              setOptionTwo(false);
              setOptionThree(false);
              setOptionFour(!optionFour);
            }}
            style={styles.checkboxView}
          />

          <HTML
            tagsStyles={{ p: { color: Colors.black, fontSize: RFValue(18, STANDARD_SCREEN_SIZE) } }}
            containerStyle={styles.optionText}
            source={{ html: answers[3].text }}
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

export default PTOptionsView;
