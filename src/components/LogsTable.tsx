/**************************
 * Imports
 **************************/
// Libraries
import * as React from 'react';
import { Input, Table} from 'antd';
import { SearchOutlined } from '@ant-design/icons';

// Internal imports
import { ILogs } from '../types';



/**************************
 * Type of props
 **************************/
interface ILogsTableProps {
    logs: ILogs[];
    searchQuery: string;
    setSearchQuery: (NewSearchQuery: string) => void;

    
}
/**************************
 * Component
 **************************/
const LogsTable = (props: ILogsTableProps) => {
    /**************************
    * Setting state variables
    **************************/

    /**************************
    * Local functions
    **************************/
      
  // Keeps the logs that match the search query.
    const filteredLogs = () => {
        if (!props.searchQuery) {
            return props.logs;
        }
    const searchedLogs = props.logs?.filter(
      (log : ILogs) => log.filename.toLowerCase().indexOf(props.searchQuery.trim().toLowerCase()) !== -1,
    );
    return searchedLogs;
  }; 
   const columns = [
        {
        title: 'Log',
        dataIndex: 'log',
        key: 'log',
        },
    ];
    const dataSource = 
        filteredLogs()?.map((logs: ILogs) => {
            return {
                key: logs.filename,
                log: logs.filename,
            };    
    });

    const sendToRout = (record: any) => {
        console.log(record.log)
    }

    /**************************
    * Render
    **************************/
   return (
        <div> 
            <Input
                placeholder= 'Search deadends here'
                prefix={<SearchOutlined/>}
                onChange={(e: any) => props.setSearchQuery(e.target.value)}
                value={props.searchQuery}
                style={{ fontSize: 20, marginBottom: 15 }}
            />
            <Table 
                columns={columns}
                dataSource={dataSource}
                onRow={(record) => {
                    return {
                      onClick: () => {sendToRout(record)}, 
                    };
                }}
            />
        </div>
    );
};

export default LogsTable;
