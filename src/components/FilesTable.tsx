/**************************
 * Imports
 **************************/
// Libraries
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import { Table, Input} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import axios from 'axios'
import moment from 'moment'

// Internal imports
import { ILogFile } from '../types';

const { Search } = Input;

/**************************
 * Component
**************************/

const FilesTable = () => {
    /**************************
    * Setting state variables
    **************************/
    const [currentLogContent, setCurrentLogContent] = useState< ILogFile[]>([]);
    const [fileIsLoading, setFileIsLoading] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');

    /**************************
    * Local variables
    **************************/
    const {fileName}= useParams();

    /**************************
    * Local functions
    **************************/    
    const columsFilter = (option: string) => {
        const categoryNames = new Set<string>();  
        currentLogContent?.map((file: ILogFile) => {
            if (option === 'thread') {
                if (!categoryNames.has(file.thread)) {
                    categoryNames.add(file.thread)
                }    
            } else {
                if (!categoryNames.has(file.level)) {
                    categoryNames.add(file.level)
                }    
            }    
        });
        const convertedCategoryNames: string[] = Array.from(categoryNames);   
        return convertedCategoryNames;
    }

    const getLogContent =  async(currentLog: string) => {
        if (currentLog?.length > 0 ) { 
            setFileIsLoading(true)
            axios.get(`http://localhost:8083/logs/${currentLog}`)
            .then(response => {
                setFileIsLoading(false)
                setCurrentLogContent(response.data)
            })
            .catch(err => {
                setFileIsLoading(false)
                if (err || !err.response) {
                    console.log("error")
                } else {
                    console.log(err)
                }  
            })
        }
    };

    useEffect(() => {
        getLogContent(fileName);
    }, [fileName] )

    const onSearchedRegexp = (value:string) => {
        setSearchQuery(value)
    }

    const filteredMessages = () => {
        if (!searchQuery) {
            return currentLogContent;
        };
        const serchedElements = currentLogContent.filter(
                (file : ILogFile) => file.message.match(searchQuery)
            );
        return serchedElements; 
    }; 

    const dataSource = 
        filteredMessages()?.map((file: ILogFile, index) => {
            return {
                key: index,
                date: file.date,
                thread: file.thread,
                level: file.level,
                message: file.message,
            };  
        }); 
    
    const columns = [
        {
            title: 'Date',
            render: (file: ILogFile) => moment.unix(file.date).format('l h:mm:ss a'),
            sorter: (a: ILogFile, b: ILogFile) => a.date - b.date, 
        },
        {
            title: 'Thread',
            dataIndex: 'thread',
            filters: columsFilter('thread')?.map((thread: string) => {
               return { 
                    text: thread,
                    value: thread
                }
            }),
            onFilter: (value: any, record: ILogFile) => record.thread.indexOf(value) === 0   
        },
        {
            title: 'Level',
            dataIndex: 'level',
            filters: columsFilter('level')?.map((level: string) => {
                return { 
                    text: level,
                    value: level
                }
             }),
            onFilter: (value: any, record: ILogFile) => record.level.indexOf(value) === 0
        },
        {
            title: 'Message',
            dataIndex: 'message',
            key: 'key',
        },
    ]; 
   
    return (
        <div>
            <Search
                placeholder='Search messages with Text or RegExp'
                prefix={<SearchOutlined/>}
                allowClear
                enterButton="Search"
                size="large"
                style={{ marginBottom: '25px' }}
                onSearch={onSearchedRegexp}
            />
            <Table 
                columns={columns}
                dataSource={dataSource}
                loading={fileIsLoading}
                pagination={{
                    defaultPageSize: 50
                }}
                scroll={{ y: 540 }}
                size='small'
            />
        </div>
    );
};

export default FilesTable;
