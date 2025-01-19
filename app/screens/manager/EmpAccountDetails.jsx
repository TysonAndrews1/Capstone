import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import userIcon from '../../../assets/images/usericon.png'; // Icon from https://www.flaticon.com/free-icon/user_847969?term=user&page=1&position=21&origin=search&related_id=847969
import editIcon from '../../../assets/images/edit.png'; // Icon from https://www.flaticon.com/free-icon/edit_1159633?term=edit&page=1&position=1&origin=search&related_id=1159633


// Still incomplete, needs save button and text input fields

export default function EmpAccountDetails() {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image source={userIcon} style={styles.profileIcon} />
                <View style={styles.profileTextContainer}>
                    <Text style={styles.profileName}>Employee Name</Text>
                </View>
                <TouchableOpacity>
                    <Image source={editIcon} style={styles.editButton} />
                </TouchableOpacity>
            </View>

            <View style={styles.detailCard}>
                <Text style={styles.detailLabel}>First Name</Text>
            </View>

            <View style={styles.detailCard}>
                <Text style={styles.detailLabel}>Last Name</Text>
            </View>

            <View style={styles.detailCard}>
                <Text style={styles.detailLabel}>Employee ID</Text>
            </View>

            <View style={styles.detailCard}>
                <Text style={styles.detailLabel}>Email Address</Text>
            </View>

            <View style={styles.detailCard}>
                <Text style={styles.detailLabel}>Home Address</Text>
            </View>

            <View style={styles.detailCard}>
                <Text style={styles.detailLabel}>Phone Number</Text>
            </View>

            <View style={styles.detailCard}>
                <Text style={styles.detailLabel}>Role</Text>
            </View>

            <View style={styles.detailCard}>
                <Text style={styles.detailLabel}>Status</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#F5F5F5',
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E6F2FA',
        padding: 16,
        borderRadius: 10,
        marginBottom: 16,
    },

    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 16,
        backgroundColor: '#D9D9D9',
    },

    profileIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 8,
    },

    profileTextContainer: {
        flex: 1,
        justifyContent: 'center',
    },

    profileName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },

    editIcon: {
        width: 24,
        height: 24,
        tintColor: '#3F6D89',
    },

    editButton: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },

    editIcon: {
        width: 18,
        height: 18,
        tintColor: '#3F6D89',
    },

    detailCard: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 10,
        marginBottom: 16,
    },

    detailLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#666',
        marginBottom: 4,
    },

    detailValue: {
        fontSize: 16,
        color: '#333',
    },
});