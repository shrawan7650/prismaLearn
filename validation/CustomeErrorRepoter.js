import { errors } from '@vinejs/vine'


export class CoustomerrorReporter {
  /**
   * A flag to know if one or more errors have been
   * reported
   */


  /**
   * A collection of errors. Feel free to give accurate types
   * to this property
   */
  errors = {}
  /**
   * VineJS call the report method
   */
  report(
    message,
    rule ,
    field,
    meta
  ) {
    hasErrors = false;
    this.errors[field.wildCardPath]

    /**
     * Collecting errors as per the JSONAPI spec
     */
    // this.errors.push({
    //   code: rule,
    //   detail: message,
    //   source: {
    //     pointer: field.wildCardPath
    //   },
    //   ...(meta ? { meta } : {})
    // })

  }

  /**
   * Creates and returns an instance of the
   * ValidationError class
   */
  createError() {
    return new errors.E_VALIDATION_ERROR(this.errors)
  }
}
