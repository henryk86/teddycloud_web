/* tslint:disable */
/* eslint-disable */
/**
 * TeddyCloud API
 * OpenAPI specification for TeddyCloud Backend API
 *
 * The version of the OpenAPI document: 1.0.1
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface ErrorsErrorsInner
 */
export interface ErrorsErrorsInner {
    /**
     * HTTP error code
     * @type {number}
     * @memberof ErrorsErrorsInner
     */
    id?: number;
    /**
     * HTTP error status
     * @type {string}
     * @memberof ErrorsErrorsInner
     */
    status?: string;
    /**
     * Error string
     * @type {string}
     * @memberof ErrorsErrorsInner
     */
    title?: string;
}

/**
 * Check if a given object implements the ErrorsErrorsInner interface.
 */
export function instanceOfErrorsErrorsInner(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function ErrorsErrorsInnerFromJSON(json: any): ErrorsErrorsInner {
    return ErrorsErrorsInnerFromJSONTyped(json, false);
}

export function ErrorsErrorsInnerFromJSONTyped(json: any, ignoreDiscriminator: boolean): ErrorsErrorsInner {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': !exists(json, 'id') ? undefined : json['id'],
        'status': !exists(json, 'status') ? undefined : json['status'],
        'title': !exists(json, 'title') ? undefined : json['title'],
    };
}

export function ErrorsErrorsInnerToJSON(value?: ErrorsErrorsInner | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'status': value.status,
        'title': value.title,
    };
}
