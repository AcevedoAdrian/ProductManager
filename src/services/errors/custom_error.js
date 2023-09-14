export default class CustomError {
  static createError(data) {
    const { name = 'Error', cause, message, code = 1 } = data;
    const error = new Error(message, { cause });
    error.name = name;
    error.code = code;
    throw error;
  }
}
