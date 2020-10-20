/**************************
 * Imports
 **************************/
// Libraries
import React, { useEffect, useState} from 'react';
import { Layout } from 'antd';
import axios from 'axios'

// Interal imports
import LogsTable from './LogsTable';
import { ILogs } from '../types';

const { Header, Content, Footer } = Layout;

/**************************
 * Component
 **************************/
const Dashboard = () => {

  /**************************
   * Setting state variables
   **************************/

  const [logs, setLogs] = useState<ILogs[]>([]);
  // const [currentLogContent, setCurrentLogContent] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  /**************************
   * Functions to pass to children
   **************************/
  const setNewSearchQuery = (NewSearchQuery: string) => {
    setSearchQuery(NewSearchQuery);
  };

  /**************************
   * Local functions
  **************************/
    const getAllLogs =  async() => {
        const response = await axios.get('http://165.227.29.60:8083/logs')

        // .catch(err => {
        //     if (!err || !err.response) {
        //         return console.log("error")
        //     }
        // })
        setLogs(response.data)

    };

    useEffect(() => {
      getAllLogs();
    }, [] )

  /**************************
   * Render
   **************************/
  return (
    <Layout>
        <Header style={{ position: 'fixed', zIndex: 1, width: '100%', color: 'white' }}>Logs dashboard</Header>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Content
                style={{
                    padding: '25px 50px',
                    marginTop: 64,
                    background: '#f0f2f5',
                    flexGrow: 1,
                }}
            >
                <div style={{ background: 'white', padding: '40px 60px' }}>
                    <LogsTable
                        logs={logs}
                        searchQuery={searchQuery}
                        setSearchQuery={setNewSearchQuery}
                    />
                </div>
            </Content>
        <Footer style={{ textAlign: 'center' }}>Made by Kamila Kowalska</Footer>
      </div>
    </Layout>
  );
};

export default Dashboard;
