export const baseLoginDto ={
    username: 'khaled.khafagy@vodafone.com',
    password: 'Trabajo50@@'
};

export const loginScenarios = [
    //positive scenario
    {
        name: 'Login with valid credentials',
        isPositive : true,
        data: {baseLoginDto}
    },
    //negative Scenarios
    {
        name: 'Login with wrong password',
        isPositive : false,
        data : {baseLoginDto, password: 'Trabajo50@'},
        expectedError: 'Invalid Credentials'


    }
];
