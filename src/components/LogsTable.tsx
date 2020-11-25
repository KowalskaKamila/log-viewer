/**************************
 * Imports
 **************************/
// Libraries
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import { Table, Input, Tag} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import axios from 'axios'
import moment from 'moment'

// Internal imports
import { ILog } from '../types';

const { Search } = Input;

// interface Icolors  {
//     '[INFO ]': string;
//     '[ERROR ]': string;
//     '[WARN ]': string;
//     '[DEBUG ]': string;
//     '[FATAL ]': string;
//     '[OFF ]': string;
//     '[TRACE ]': string;
// }

/**************************
 * Component
**************************/

const LogsTable = () => {
    /**************************
    * Setting state variables
    **************************/
    const [currentLogContent, setCurrentLogContent] = useState< ILog[]>([]);
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
        currentLogContent?.map((file: ILog) => {
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

    const getLogContent = async(currentLog: string) => {
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
            (file : ILog) => file.message.toLowerCase().match(searchQuery.toLowerCase())
        );
        return serchedElements; 
    }; 

    const dataSource = 
        filteredMessages()?.map((file: ILog, index) => {
            return {
                key: index,
                date: file.date,
                thread: file.thread,
                level: file.level,
                message: file.message,
            };  
        }); 

    const setColor = (level : string) =>  {
        let color : string|undefined ='';    
        const logsColors: Map<string, string> = new Map([
            ['[INFO ]', 'orange'],
            ['[ERROR ]', 'red',],
            ['[WARN ]', 'magenta'],
            ['[DEBUG ]', 'green'],
            ['[FATAL ]', 'purple'],
            ['[OFF ]', 'black'],
            ['[TRACE ]', 'blue']
        ]);
    
        if (logsColors.has(level)){
            color = logsColors.get(level)
        } else {
            color = 'lightgrey'
        }     
        return color
    }

    const getNumberOfLogs = (level : string) => {
        return (currentLogContent.filter((log: ILog) => log.level === level)).length;
    }
    
    const columns = [
        {
            title: 'Date',
            render: (file: ILog) => moment.unix(file.date).format('l h:mm:ss a'),
            sorter: (a: ILog, b: ILog) => a.date - b.date, 
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
            onFilter: (value: any, record: ILog) => record.thread.indexOf(value) === 0   
        },
        {
            title: 'Level',
            dataIndex: 'level',
            render: (level: string) => ( 
                <Tag 
                    style= {{width: '80px', textAlign: 'center'}} 
                    color= {setColor(level)}
                >   
                    {level}
                </Tag> 
            ),
            filters: columsFilter('level')?.map((level: string) => {
                return { 
                    text:  
                        <Tag 
                            style= {{width: '100px', textAlign: 'center'}} 
                            color= {setColor(level)}
                        >
                            {`${level} - ${getNumberOfLogs(level)}`}
                        </Tag>,
                    value: level
                }
             }),
            onFilter: (value: any, record: ILog) => record.level.indexOf(value) === 0
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
                title={() =>`All logs: ${currentLogContent.length}`}
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

export default LogsTable;
