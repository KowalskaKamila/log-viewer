/**************************
 * Imports
 **************************/
// Libraries
import * as React from 'react';
import { Link } from 'react-router-dom'
import { Input, Table} from 'antd';
import { SearchOutlined } from '@ant-design/icons';

// Internal imports
import { ILogFile } from '../types';

/**************************
 * Type of props
 **************************/
interface IFilesTableProps {
    logs: ILogFile[];
    logsLoading: boolean;
    searchQuery: string;
    setSearchQuery: (NewSearchQuery: string) => void;    
}

/**************************
 * Component
 **************************/
const FilesTable = (props: IFilesTableProps) => {
 
    /**************************
    * Local functions
    **************************/  
    // Keeps the logs that match the search query.
    const filteredLogs = () => {
        if (!props.searchQuery) {
            return props.logs;
        };
        const searchedLogs = props.logs?.filter(
            (log : ILogFile) => log.filename.toLowerCase().indexOf(props.searchQuery.trim().toLowerCase()) !== -1,
        );
        return searchedLogs;
    }; 

    const columns = [
        {
            title: 'Log file',
            dataIndex: 'log',
            key: 'log',
            render: (log:ILogFile) => <Link to={`/${log}`}>{log}</Link>
        },
    ];

    const dataSource = 
        filteredLogs()?.map((logs: ILogFile) => {
            return {
                key: logs.filename,
                log: logs.filename,
            };    
        });

    /**************************
    * Render
    **************************/
    return (
        <div> 
            <Input
                placeholder= 'Search logs files'
                prefix={<SearchOutlined/>}
                onChange={(e: any) => props.setSearchQuery(e.target.value)}
                value={props.searchQuery}
                style={{ fontSize: 20, marginBottom: 15 }}
            />
            <Table 
                loading={props.logsLoading}
                columns={columns}
                dataSource={dataSource}   
            />
        </div>
    );
};

export default FilesTable;
