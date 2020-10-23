/***********************************************************************
 *  List of all object type definitions. 
 ***********************************************************************/

// Syntax with I prefix in the name indicates a type

// The type of logs event
export interface ILogs {
    filename: string;
}

export interface ILogFile {
  date: string;
  thread: string;
  level: string;
  message: string;
}