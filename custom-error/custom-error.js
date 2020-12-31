class CustomError extends Error {
    constructor(type = null, ...params){
        super(...params)

        if(Error.captureStackTrace){
            Error.captureStackTrace(this, CustomError)
        }

        this.name = 'CustomError';

        this.type = type;
    }
}

module.exports = CustomError