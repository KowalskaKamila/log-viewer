/***********************************************************************
 * This is a list of all object type definitions. In here, we make clear
 *      the fields that each object should have and the types of those fields
 * We put it in a separate file because they're used across components
 ***********************************************************************/

// Syntax with I prefix in the name indicates a type

// The type of logs event
export interface ILogs {
    filename: string;
  }