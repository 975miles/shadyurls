module.exports = {
    port: 8080, //What port the web server will run on.
    maxPageLength: 2000, //How long the text for a page can be.
    redirectURL: '', //What URL to redirect a user to after their page is created. (ok this aint a great explanation)
    
    blocks: {
        availableChars: [ //The characters that will be in the blocks be made up of.
            '0',
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9',
            'a',
            'b',
            'c',
            'd',
            'e',
            'f',
        ],
        amount: 8, //How many blocks of characters there are.
        charAmount: 4, //How many characters there are in each block.
        separator: ':', //What string each block is separated by.
        prefix: '[', //What string that the entire block is prefixed with.
        suffix: ']', //What string that the entire block is suffixed with.
    },
};