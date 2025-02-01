import React, { useEffect } from "react";
import { View, Modal, TouchableWithoutFeedback, StyleSheet } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";

const BottomSheetModal = ({ visible, onClose, children, height = 400 }) => {
    const translateY = useSharedValue(height);

    useEffect(() => {
        if (visible) {
            translateY.value = withTiming(0, { duration: 300 });
        } else {
            translateY.value = withTiming(height, { duration: 300 });
        }
    }, [visible]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    return (
        <Modal transparent visible={visible} animationType="none">
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <Animated.View style={[styles.modalContainer, { height }, animatedStyle]}>
                        {children}
                    </Animated.View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "flex-end",
    },
    modalContainer: {
        width: "100%",
        backgroundColor: "#fff",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 16,
        position: "absolute",
        bottom: 60, 
    },
});

export default BottomSheetModal;
