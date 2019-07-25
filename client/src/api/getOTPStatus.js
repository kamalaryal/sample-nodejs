export const getOTPStatus = () => {
    return JSON.parse(localStorage.getItem('OTPStatus'));
}