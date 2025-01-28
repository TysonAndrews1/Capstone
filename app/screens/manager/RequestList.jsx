import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, StyleSheet, View, Image } from 'react-native';
import MainLayout from '../../layouts/MainLayout';

// Styling heavily inspired by EventList.jsx

export default function RequestList() {
    const [selectedOption, setSelectedOption] = useState('awaiting');

    const handleSelect = (option) => { // Function to select between "Awaiting Requests" and "Completed Requests"
        setSelectedOption(option);
    };

    const testRequests = [ // Test data
        { id: 1, name: 'Test Request', type: 'Time off' },
        { id: 2, name: 'Test Request 2', type: 'Shift swap' },
    ];

    return (
        <MainLayout>
            <View style={styles.container}>
                <View style={styles.optionsContainer}>
                <TouchableOpacity onPress={() => handleSelect('awaiting')}>
                    <View style={[styles.option, selectedOption === 'awaiting' && styles.selectedOption]}>
                        <Text style={[styles.optionText, selectedOption === 'awaiting' && styles.selectedText]}>Awaiting Requests</Text>
                        {selectedOption === 'awaiting' && <View style={styles.underline} />}
                    </View>
                </TouchableOpacity>

                <View style={styles.constantUnderline} />

                <TouchableOpacity onPress={() => handleSelect('completed')}> 
                    <View style={[styles.option, selectedOption === 'completed' && styles.selectedOption]}>
                        <Text style={[styles.optionText, selectedOption === 'completed' && styles.selectedText]}>Completed Requests</Text>
                        {selectedOption === 'completed' && <View style={styles.underline} />}
                    </View>
                </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.requestList}>
                    {selectedOption === 'awaiting' && testRequests.map((request) => (
                        <View key={request.id} style={styles.requestItem}>
                            <View style={styles.requestInfo}>
                                <Text style={styles.name}>{request.name}</Text>
                                <Text style={styles.requestType}>Request Type: {request.type}</Text>
                            </View>
                            <TouchableOpacity>
                                <Text style={styles.viewButtonText}>View Request</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>
            </View>
        </MainLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 10,
        paddingBottom: 80,
    },

    optionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },

    option: {
        marginHorizontal: 7,
    },

    optionText: {
        fontSize: 18,
    },

    selectedText: {
        fontWeight: 'bold',
    },

    selectedOption: {
        paddingBottom: 5,
    },

    underline: {
        height: 2,
        backgroundColor: '#3F6D89',
        width: '100%',
        position: 'absolute',
        bottom: 0,
        left: 0,
    },

    constantUnderline: {
        height: 2,
        backgroundColor: '#3F6D89',
        flex: 1,
        marginHorizontal: 10,
    },

    requestList: {
        flexGrow: 1,
        width: '100%',
    },

    requestItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#E6F2Fa',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        width: '90%',
        alignSelf: 'center',
    },

    requestInfo: {
        flex: 1,
    },

    name: {
        fontWeight: 'bold',
        fontSize: 16,
    },

    requestType: {
        color: '#666',
        fontSize: 14,
    },

    viewButtonText: {
        color: '#666',
        fontSize: 14,
        textDecorationLine: 'underline',
    },
});
