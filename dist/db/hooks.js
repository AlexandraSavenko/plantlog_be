"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applySchemaHooks = exports.setUpdateSettings = exports.handleSaveErrorStatus = void 0;
const handleSaveErrorStatus = (error, data, next) => {
    //in case email already exist in db, error will have code 11000 but in case email is invalid error.code = undefined
    const { code, name } = error;
    error.status = (name === "MongoServerError" && code === 11000) ? 409 : 400;
    next();
};
exports.handleSaveErrorStatus = handleSaveErrorStatus;
//arrow function wouldn't allow to use this, so function expression is used !!!
//Also without passing this as an argument mongoose looses track of it because the function is in hooks.ts
const setUpdateSettings = function (next) {
    // this.options.runValidators = true;
    // this.options.new = true
    this.setOptions({ runValidators: true, new: true });
    next();
};
exports.setUpdateSettings = setUpdateSettings;
const applySchemaHooks = (schema) => {
    schema.post("save", exports.handleSaveErrorStatus);
    schema.pre("findOneAndUpdate", exports.setUpdateSettings);
    schema.post("findOneAndUpdate", exports.handleSaveErrorStatus);
    // schema.post("save", function() {
    //     console.log("Saving went well!")
    // })
};
exports.applySchemaHooks = applySchemaHooks;
