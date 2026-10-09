export const parsePhoneNumber = (phoneNumber: string) => {
    let cleanNumber = phoneNumber.replace(/\D/g, '');

    if (cleanNumber.startsWith('62')) {
        cleanNumber = cleanNumber.substring(2);
    }

    cleanNumber = cleanNumber.replace(/^0+/, '');

    return '62' + cleanNumber;
};
