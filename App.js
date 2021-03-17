import React from 'react';
import {useEffect} from 'react';
import {View, Text, Pressable, SafeAreaView, StyleSheet} from 'react-native';
import {PanGestureHandler} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  withTiming,
  withSpring,
  withDelay,
  withRepeat,
  interpolateColor,
  useAnimatedGestureHandler,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';

const App = () => {
  const opacity = useSharedValue(0);
  const touchX = useSharedValue(0);
  const touchY = useSharedValue(0);
  const scrollY = useSharedValue(0);

  const gestureHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      touchX.value = event.translationX;
      touchY.value = event.translationY;
    },
    onEnd: () => {
      touchX.value = withSpring(0);
      touchY.value = withSpring(0);
    },
  });

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        {
          scale: interpolate(opacity.value, [0, 1], [0.5, 1]),
        },
      ],
      backgroundColor: interpolateColor(opacity.value, [0, 1], ['red', 'pink']),
    };
  });

  const animatedTouchStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: touchX.value,
        },
        {
          translateY: touchY.value,
        },
      ],
    };
  });

  const animatedScrollStyles = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        scrollY.value,
        [-50, 0, 50],
        ['#000', '#fff', '#000'],
      ),
    };
  });

  // Basics
  // useEffect(() => {
  //   opacity.value = withRepeat(
  //     withTiming(1, {
  //       duration: 1000,
  //     }),
  //     -1,
  //     true,
  //   );
  // }, []);

  return (
    <Animated.ScrollView
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      contentContainerStyle={styles.contentContainerStyle}
      style={[styles.scrollView, animatedScrollStyles]}>
      {/* <View style={styles.container}> */}
      <SafeAreaView />
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[styles.circle, animatedTouchStyles]} />
      </PanGestureHandler>
      {/* </View> */}
    </Animated.ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    backgroundColor: '#ddd',
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  scrollView: {
    height: '100%',
    width: '100%',
  },
  contentContainerStyle: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
