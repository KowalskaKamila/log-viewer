/***********************************************************************
 *  List of all object type definitions. 
 ***********************************************************************/

// Syntax with I prefix in the name indicates a type

export interface ILogFile {
    filename: string;
}

export interface ILog {
  date : number;
  thread: string;
  level: string;
  message: string;
}