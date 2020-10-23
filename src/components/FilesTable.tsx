/**************************
 * Imports
 **************************/
// Libraries
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import { Table } from 'antd';
import axios from 'axios'

// Internal imports
import { ILogFile } from '../types';

/**************************
 * Component
**************************/

const FilesTable = () => {
    /**************************
    * Setting state variables
    **************************/
    const [currentLogContent, setCurrentLogContent] = useState< ILogFile[]>([]);
    const [fileIsLoading, setFileIsLoading] = useState<boolean>(false);
    /**************************
    * Local variables
    **************************/
    const {fileName}= useParams();

    /**************************
    * Local functions
    **************************/
    
    const getThreads = () => {
        const threads = new Set<string>();  
        currentLogContent?.map((file: ILogFile) => {
            if (!threads.has(file.thread)) {
                threads.add(file.thread)
            }    
        });
        const convertThreads: string[] = Array.from(threads);   
        return convertThreads;
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

    const columns = [
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'key',
            // sorter: (a: ILogFile, b: ILogFile) => a.(date) - b.date, 
        },
        {
            title: 'Thread',
            dataIndex: 'thread',
            key: 'key',
            filters: getThreads()?.map((file: string) => {
               return { 
                    text: file,
                    value: file
                }
            }),
            onFilter: (value: any, record: ILogFile) => record.thread.indexOf(value) === 0,    
        },
        {
            title: 'Level',
            dataIndex: 'level',
            key: 'key',
        },
        {
            title: 'Message',
            dataIndex: 'message',
            key: 'key',
        },
    ];

    const dataSource = 
        currentLogContent?.map((file: ILogFile, index) => {
            return {
                key: index,
                date: file.date,
                thread: file.thread,
                level: file.level,
                message: file.message,
            };    
    });

    return (
        <Table 
            columns={columns}
            dataSource={dataSource}
            loading={fileIsLoading}
            size='small'
        />
    );
};

export default FilesTable;
