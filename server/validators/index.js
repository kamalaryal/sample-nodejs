const Joi = require('@hapi/joi');

exports.validator = (body, schema) => {
    //Start validation
    const validationError = Joi.validate(body, schema, {abortEarly: false});
    if (validationError.error !== null) {
        console.log("VALIDATION ERROR:", validationError);
    }
  
    let validationErrorLog = [];
    
    if(validationError && validationError.error && validationError.error.details){
        let errorDetails = validationError.error.details;

        errorDetails.forEach(element => {

            validationErrorLog.push(element.message.toString().replace(/"/g, ''));
        
        });

        return validationErrorLog;

    }else{
        return false;
    }
    //End Validation
}